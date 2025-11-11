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
      const response = await fetch(
        `${NHTSA_BASE_URL}/GetMakesForVehicleType/car?format=json&modelyear=${year}`
      );
      const data: VehicleApiResponse = await response.json();
      // Deduplicate makes and filter out empty values
      const uniqueMakes = Array.from(new Set(
        data.Results
          .map((make: any) => make.MakeName)
          .filter((name: string) => name && name.trim())
      ));
      
      // Filter to common US makes to reduce clutter
      const filtered = uniqueMakes.filter(make => 
        COMMON_US_MAKES.has(make.toUpperCase())
      );
      
      return filtered.sort((a, b) => a.localeCompare(b));
    } catch (error) {
      console.error('Error fetching makes:', error);
      return [];
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