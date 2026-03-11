const NHTSA_BASE_URL = 'https://vpic.nhtsa.dot.gov/api/vehicles';

// Common US market makes to reduce clutter from obscure/defunct brands
const COMMON_US_MAKES = new Set([
  'ACURA', 'ALFA ROMEO', 'ASTON MARTIN', 'AUDI', 'BENTLEY', 'BMW', 'BUICK',
  'CADILLAC', 'CHEVROLET', 'CHRYSLER', 'DODGE', 'FERRARI', 'FIAT', 'FORD',
  'GENESIS', 'GMC', 'HONDA', 'HYUNDAI', 'INFINITI', 'JAGUAR', 'JEEP', 'KIA',
  'LAMBORGHINI', 'LAND ROVER', 'LEXUS', 'LINCOLN', 'LOTUS', 'MASERATI', 'MAZDA',
  'MCLAREN', 'MERCEDES-BENZ', 'MINI', 'MITSUBISHI', 'NISSAN', 'PONTIAC',
  'PORSCHE', 'RAM', 'ROLLS-ROYCE', 'SAAB', 'SATURN', 'SCION', 'SUBARU', 'SUZUKI',
  'TESLA', 'TOYOTA', 'VOLKSWAGEN', 'VOLVO'
]);

// Allowlist of legitimate pure-numeric consumer model names seen in US market
// Others like 1225U, 2600U, etc. are typically industrial/chassis codes we want to hide
const ALLOWED_PURE_NUMERIC = new Set(['86', '200', '300', '500', '1500', '2500', '3500', '4500', '5500']);

export interface VehicleApiResponse<T = Record<string, unknown>> {
  Count: number;
  Message: string;
  SearchCriteria: string;
  Results: T[];
}

type MakeResult = {
  MakeId?: number;
  MakeName?: string;
};

type ModelResult = {
  Model_Name?: string;
};

export const vehicleApi = {
  async getMakes(year: string): Promise<string[]> {
    try {
      // Fetch makes from multiple relevant vehicle types and union them
      const types = ['car', 'truck', 'mpv']; // mpv = multipurpose passenger vehicle (SUV/crossover)
      const results = await Promise.allSettled(
        types.map(t => fetch(`${NHTSA_BASE_URL}/GetMakesForVehicleType/${t}?format=json&modelyear=${year}`))
      );

      const datasets: VehicleApiResponse<MakeResult>[] = [];
      for (const r of results) {
        if (r.status === 'fulfilled') {
          try {
            const json: VehicleApiResponse<MakeResult> = await r.value.json();
            datasets.push(json);
          } catch {
            // ignore malformed payloads from one endpoint and continue
          }
        }
      }

      const allMakes = datasets.flatMap((d) =>
        (d.Results || [])
          .map((m) => {
            const typed = m as MakeResult;
            return String(typed.MakeName || '').trim();
          })
          .filter(Boolean)
      );
      const uniqueMakes = Array.from(new Set(allMakes.map(n => n.toUpperCase())));

      // Intersect with our curated list; if intersection is small, fall back to curated list
      const filtered = uniqueMakes.filter(n => COMMON_US_MAKES.has(n));
      const finalList = (filtered.length >= 10 ? filtered : Array.from(COMMON_US_MAKES))
        .map(n => n) // already uppercase
        .sort((a, b) => a.localeCompare(b));

      return finalList;
    } catch (error) {
      console.error('Error fetching makes:', error);
      // Fallback to curated makes on failure so the form is never blocked
      return Array.from(COMMON_US_MAKES).sort((a, b) => a.localeCompare(b));
    }
  },

  async getModels(year: string, make: string): Promise<string[]> {
    try {
      // Strategy: Prefer makeId-based endpoint for better data hygiene,
      // then fall back to name-based endpoint if id not found.
      const makesRes = await fetch(
        `${NHTSA_BASE_URL}/GetMakesForVehicleType/car?format=json&modelyear=${year}`
      );
      const makesData: VehicleApiResponse<MakeResult> = await makesRes.json();
      const candidate = (makesData.Results || []).find((m) => {
        const typed = m as MakeResult;
        return String(typed.MakeName || '').toUpperCase() === String(make).toUpperCase();
      }
      );

      // We'll query both the makeId endpoint (if available) and the name-based
      // endpoint, then merge their Results.  The ID endpoint often returns only
      // car models; Dodge trucks are sometimes missing, which is why users saw
      // only five entries.  By unioning the two responses we capture anything
      // the name endpoint provides as a fallback.
      let modelsById: VehicleApiResponse<ModelResult> | null = null;
      if (candidate?.MakeId) {
        try {
          const resp = await fetch(
            `${NHTSA_BASE_URL}/GetModelsForMakeIdYear/makeId/${candidate.MakeId}/modelyear/${year}?format=json`
          );
          modelsById = await resp.json();
        } catch {
          modelsById = null;
        }
      }

      const encodedMake = encodeURIComponent(make);
      let modelsByName: VehicleApiResponse<ModelResult> | null = null;
      try {
        const resp = await fetch(
          `${NHTSA_BASE_URL}/GetModelsForMakeYear/make/${encodedMake}/modelyear/${year}?format=json`
        );
        modelsByName = await resp.json();
      } catch {
        modelsByName = null;
      }

      // merge results (dedupe later)
      const allResults: ModelResult[] = [];
      if (modelsById && modelsById.Results) allResults.push(...modelsById.Results);
      if (modelsByName && modelsByName.Results) allResults.push(...modelsByName.Results);

      const rawModels: string[] = allResults
        .map((r) => String(r.Model_Name || '').trim())
        .filter(Boolean);


      // Filter out garbage/industrial or non-consumer labels frequently seen in VPIC
      const BAD_TOKENS = /(series|industries|incomplete|glider|chassis|cutaway|cab|fleet)/i;
      const cleaned = rawModels
        .filter((name) => name && String(name).trim())
        .filter((name) => !BAD_TOKENS.test(String(name)))
        .map((name) => String(name).trim())
        .filter((name) => {
          // Drop most code-like numeric entries, keep only known consumer numerics
          if (/^[0-9]+$/.test(name)) return ALLOWED_PURE_NUMERIC.has(name);
          if (/^[0-9]+[A-Za-z]+$/.test(name)) {
            const num = (name.match(/^[0-9]+/) || [''])[0];
            return ALLOWED_PURE_NUMERIC.has(num);
          }
          return true;
        });

      const uniqueModels = Array.from(new Set(cleaned));
      return uniqueModels.sort((a, b) => a.localeCompare(b));
    } catch (error) {
      console.error('Error fetching models:', error);
      return [];
    }
  }
};