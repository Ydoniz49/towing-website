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
      return data.Results
        .map((make: any) => make.MakeName)
        .sort((a, b) => a.localeCompare(b));
    } catch (error) {
      console.error('Error fetching makes:', error);
      return [];
    }
  },

  async getModels(year: string, make: string): Promise<string[]> {
    try {
      const response = await fetch(
        `${NHTSA_BASE_URL}/GetModelsForMakeYear/make/${make}/modelyear/${year}?format=json`
      );
      const data: VehicleApiResponse = await response.json();
      return data.Results
        .map((model: any) => model.Model_Name)
        .sort((a, b) => a.localeCompare(b));
    } catch (error) {
      console.error('Error fetching models:', error);
      return [];
    }
  }
};