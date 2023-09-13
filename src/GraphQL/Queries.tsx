import { gql } from "@apollo/client";

export type CountryData = {
    name: string,
    code: string
} 

export type CountriesResult = {
    countries: Array<CountryData>
}

export const LOAD_COUNTRIES = gql`
  {
    countries {
      name
      code
    }
  }
`;
