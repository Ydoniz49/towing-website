const NHTSA_BASE_URL = 'https://vpic.nhtsa.dot.gov/api/vehicles';

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
      return uniqueMakes.sort((a, b) => a.localeCompare(b));
    } catch (error) {
      console.error('Error fetching makes:', error);
      return [];
    }
  },

  async getModels(year: string, make: string): Promise<string[]> {
    try {
      // URL-encode the make name to handle special characters and spaces
      const encodedMake = encodeURIComponent(make);
      const response = await fetch(
        `${NHTSA_BASE_URL}/GetModelsForMakeYear/make/${encodedMake}/modelyear/${year}?format=json`
      );
      const data: VehicleApiResponse = await response.json();
      
      // Deduplicate models and filter out empty values
      const uniqueModels = Array.from(new Set(
        data.Results
          .map((model: any) => model.Model_Name)
          .filter((name: string) => name && name.trim())
      ));
      
      return uniqueModels.sort((a, b) => a.localeCompare(b));
    } catch (error) {
      console.error('Error fetching models:', error);
      return [];
    }
  }
};