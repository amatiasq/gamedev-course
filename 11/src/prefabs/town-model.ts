import Building from "./building";


export default class TownModel {
  constructor(
    public stats: TownStats,
    private coefficients: TownStatsCoeficients = {},
    private buildings: Array<Building> = []
  ) {
    this.coefficients.populationGrowth = this.coefficients.populationGrowth || 1.02;
    this.coefficients.foodConsumption = this.coefficients.foodConsumption || 1;
    this.coefficients.productivityPerPerson = this.coefficients.productivityPerPerson || 0.5;
  }

  step() {
    this.updateBuildingProduction();
    this.stats.population *= this.coefficients.populationGrowth;
    this.stats.population = Math.min(this.stats.population, this.stats.housing);

    this.stats.food -= this.stats.population * this.coefficients.foodConsumption;

    if (this.stats.food < 0) {
      this.stats.population += this.stats.food / this.coefficients.foodConsumption;
      this.stats.food = 0;
    }

    this.stats.money += Math.min(this.stats.population, this.stats.jobs) * this.coefficients.productivityPerPerson;

    console.log(this.stats);
  }

  private updateBuildingProduction() {
    this.stats.housing = 0;
    this.stats.jobs = 0;

    this.buildings.forEach((building: Building) => {
      if (building.housing)
        this.stats.housing += building.housing;

      if(building.jobs)
        this.stats.jobs += building.jobs;

      if (building.food)
        this.stats.food += building.food;
    });
  }
}


export interface TownStats {
  population: number,
  food: number,
  money: number,
  jobs: number,
  housing?: number,
}


export interface TownStatsCoeficients {
  populationGrowth?: number,
  foodConsumption?: number,
  productivityPerPerson?: number,
}