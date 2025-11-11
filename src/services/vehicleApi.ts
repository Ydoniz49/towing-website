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

export interface VehicleApiResponse {
  Count: number;
  Message: string;
  SearchCriteria: string;
  Results: any[];
}

export const vehicleApi = {
  async getMakes(year: string): Promise<string[]> {
    try {
      // Fetch makes from multiple relevant vehicle types and union them
      const types = ['car', 'truck', 'mpv']; // mpv = multipurpose passenger vehicle (SUV/crossover)
      const results = await Promise.allSettled(
        types.map(t => fetch(`${NHTSA_BASE_URL}/GetMakesForVehicleType/${t}?format=json&modelyear=${year}`))
      );

      const datasets: VehicleApiResponse[] = [];
      for (const r of results) {
        if (r.status === 'fulfilled') {
          try {
            const json: VehicleApiResponse = await r.value.json();
            datasets.push(json);
          } catch {}
        }
      }

      const allMakes = datasets.flatMap(d => (d.Results || []).map((m: any) => String(m.MakeName).trim()).filter(Boolean));
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
      const makesData: VehicleApiResponse = await makesRes.json();
      const candidate = (makesData.Results || []).find((m: any) =>
        String(m.MakeName).toUpperCase() === String(make).toUpperCase()
      );

      let modelsData: VehicleApiResponse | null = null;
      if (candidate?.MakeId) {
        const byId = await fetch(
          `${NHTSA_BASE_URL}/GetModelsForMakeIdYear/makeId/${candidate.MakeId}/modelyear/${year}?format=json`
        );
        modelsData = await byId.json();
      }

      if (!modelsData) {
        const encodedMake = encodeURIComponent(make);
        const byName = await fetch(
          `${NHTSA_BASE_URL}/GetModelsForMakeYear/make/${encodedMake}/modelyear/${year}?format=json`
        );
        modelsData = await byName.json();
      }

  const rawModels: string[] = ((modelsData && modelsData.Results) ? modelsData.Results : []).map((r: any) => r.Model_Name);

      // Filter out garbage/industrial or non-consumer labels frequently seen in VPIC
      const BAD_TOKENS = /(series|industries|incomplete|glider|chassis|cutaway|cab|fleet)/i;
      const cleaned = rawModels
        .filter((name) => name && String(name).trim())
        .filter((name) => !BAD_TOKENS.test(String(name)))
        .map((name) => name.trim());

      const uniqueModels = Array.from(new Set(cleaned));
      return uniqueModels.sort((a, b) => a.localeCompare(b));
    } catch (error) {
      console.error('Error fetching models:', error);
      return [];
    }
  }
};