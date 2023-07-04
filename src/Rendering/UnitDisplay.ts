import { Angle } from "../Common/Angle";
import { Epsilon } from "../Constants";

export class UnitDisplay {
  static Mass(input: number): string {
    return `${input.toLocaleString("en-US", { maximumFractionDigits: 1 })} kg`;
  }

  // public static string Mass(double mass)
  // {
  //     if (mass > 10000000)
  //     {
  //         return mass.ToString("0.#e0") + " kg";
  //     }

  //     if (mass > 1000)
  //     {
  //         return mass.ToString("#,##0") + " kg";
  //     }

  //     return mass.ToString("#,##0") + " kg";
  // }

  // public static string Density(double density)
  // {
  //     return density.ToString("0.##0") + " kg/m³";
  // }

  // public static string Pressure(double pressure)
  // {
  //     if (pressure > 1000)
  //     {
  //         pressure *= 0.001;

  //         return pressure.ToString("#,##0.0") + " kPa";
  //     }

  //     return pressure.ToString("#,##0.0") + " Pa";
  // }

  // public static string Heat(double heatingRate)
  // {
  //     if (heatingRate > 1000)
  //     {
  //         heatingRate *= 0.001;

  //         return heatingRate.ToString("#,##0.0") + " kW/m²";
  //     }

  //     return heatingRate.ToString("#,##0.0") + " W/m²";
  // }

  static Degrees(input: number, normalize: boolean = false): string {
    if (normalize) {
      input = Angle.Normalize(input);
    } else {
      if (input > Math.PI * 2) {
        input = Math.PI - input;
      }

      if (input < Math.PI * -2) {
        input = -(Math.PI + input);
      }
    }

    return (input * 57.2958).toLocaleString("en-US", { maximumFractionDigits: 1, minimumFractionDigits: 1 });
  }

  static Speed(input: number): string {
    if (Math.abs(input) < Epsilon) {
      return "0.0 m/s";
    }

    if (input > 1000 || input < -1000) {
      return `${(input * 0.001).toLocaleString("en-US", { maximumFractionDigits: 1, minimumFractionDigits: 1 })} km/s`;
    }

    return `${input.toLocaleString("en-US", { maximumFractionDigits: 1, minimumFractionDigits: 1 })} m/s`;
  }

  static Distance(input: number): string {
    if (Math.abs(input) < Epsilon) {
      return "0.0 m";
    }

    if (input > 1000 || input < -1000) {
      return `${(input * 0.001).toLocaleString("en-US", { maximumFractionDigits: 1, minimumFractionDigits: 1 })} km`;
    }

    return `${input.toLocaleString("en-US", { maximumFractionDigits: 1, minimumFractionDigits: 1 })} m`;
  }

  static Acceleration(input: number): string {
    const force: number = input / 9.81;

    if (force < Epsilon) {
      return "0.00 g";
    }

    return `${force.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 1 })} g`;
  }
}
