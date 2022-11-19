import { useCallback, useEffect, useState } from "react";

export interface PokeObject {
  id: number;
  name: string;
  image: string;
  isOpen: boolean;
  isMatched: boolean;
}

export interface PokeProps {
  isPaused: boolean;
  firstPick: number | null;
  matches: number;
  pokemonList: Array<PokeObject>;
}

const pokeAPIBaseUrl = "https://pokeapi.co/api/v2/pokemon/";

const loadPokemon = async () => {
  const randomIds = new Set();
  while (randomIds.size < 8) {
    const randomNumber = Math.ceil(Math.random() * 150);
    randomIds.add(randomNumber);
  }
  const pokePromises = [...randomIds].map((id) => fetch(pokeAPIBaseUrl + id));
  const results = await Promise.all(pokePromises);
  return await Promise.all(results.map((res) => res.json()));
};

const useStatePokemon = (): [pokeData: PokeProps, setData: Function] => {
  const [pokeData, setPokeData] = useState<PokeProps>({
    isPaused: false,
    firstPick: null,
    matches: 0,
    pokemonList: [],
  });

  const fetchPokeData = useCallback(async () => {
    const response = await loadPokemon();
    let formatedPokeData = response.map((value) => {
      return {
        id: value?.id,
        name: value?.name,
        image: value?.sprites?.front_default,
        isOpen: false,
        isMatched: false,
      };
    });

    const clonedData = JSON.parse(JSON.stringify(formatedPokeData));
    const shuffledData = await clonedData.sort(() => 0.5 - Math.random());

    setPokeData({
      isPaused: false,
      firstPick: null,
      matches: 0,
      pokemonList: [...formatedPokeData, ...shuffledData],
    });
  }, []);

  useEffect(() => {
    fetchPokeData();
  }, [fetchPokeData]);

  return [pokeData, setPokeData];
};

export default useStatePokemon;
