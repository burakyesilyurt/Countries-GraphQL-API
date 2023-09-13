import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import {
    CountriesResult,
    CountryData,
    LOAD_COUNTRIES,
} from "../GraphQL/Queries";
import "../table.css";

const predefinedColors = ["#283044", "#BD1E1E", "#A1833D", "#027333"];

const getRandomColor = (previousColor: string = "") => {
  let randomColor;
  do {
    randomColor =
      predefinedColors[Math.floor(Math.random() * predefinedColors.length)];
  } while (randomColor === previousColor);
  return randomColor;
};

const selectTenthItem = (
  countries: CountryData[] | undefined
): string | null => {
  if (countries == undefined || countries.length <= 0) return null;
  const itemToSelect = Math.min(9, countries.length - 1);
  return countries[itemToSelect].code;
};

export const GetCountries = () => {
  const { data, loading, error } = useQuery<CountriesResult>(LOAD_COUNTRIES, {
    onCompleted: ({ countries }) => {
      setSelectedItem(selectTenthItem(countries));
    },
  });

  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState<string | null>();
  const [bgColor, setBgColor] = useState<string>(getRandomColor());

  useEffect(() => {
    if (data && !loading) {
      setSelectedItem(() => selectTenthItem(filterData));
      setBgColor(getRandomColor(bgColor));
    }
  }, [search]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  const filterData = data?.countries.filter((items) =>
    items.name.toString().toLowerCase().includes(search.toLowerCase())
  );

  const handleClick = (countryCode: string) => {
    if(countryCode === selectedItem ){
        setSelectedItem(null)
        return
    }
    setBgColor(getRandomColor(bgColor));
    setSelectedItem(countryCode);
  };

  return (
    <>
      <div className="my-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          placeholder="Search..."
          className="h-8 border rounded text-sm px-4 w-full outline-none"
        />
      </div>
      <div className="w-full border rounded p-2">
        <table className="w-full">
          <thead>
            <tr>
              <th className="p-2">Countries</th>
              <th className="p-2">Code</th>
            </tr>
          </thead>
          <tbody>
            {filterData?.map(({ name, code }) => (
              <tr
                style={{
                  backgroundColor: code === selectedItem ? bgColor : "",
                }}
                onClick={() => handleClick(code)}
                className="group"
                key={code}
              >
                <td className="p-2 text-sm group-hover:bg-gray-700">{name}</td>
                <td className="p-2 text-sm group-hover:bg-gray-700">{code}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
