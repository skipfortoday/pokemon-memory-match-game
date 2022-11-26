import Image from "next/image";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import useGetMediumArticles, {
  PokeObject,
} from "services/customHooks/useStatePokemon";
import { authProvider } from "web3/authprovider";
import "react-toastify/dist/ReactToastify.min.css";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
export default function Home() {
  const [pokeData, setPokeData] = useGetMediumArticles();
  const [identity, setIdentity] = useState({ address: "", balance: "" });

  useEffect(() => {
    getIndentity();
    return () => {
      setIdentity({ address: "", balance: "" });
    };
  }, []);

  const checkIsMatched = async (
    tempArray: Array<PokeObject>,
    arrayId: number
  ) => {
    await delay(900);
    if (pokeData.firstPick !== null) {
      const isMatched =
        tempArray[pokeData.firstPick]["id"] === tempArray[arrayId]["id"] &&
        arrayId !== pokeData.firstPick
          ? true
          : false;
      const count = isMatched ? pokeData.matches + 1 : pokeData.matches;
      tempArray[arrayId]["isOpen"] = isMatched;
      tempArray[pokeData.firstPick]["isOpen"] = isMatched;
      tempArray[arrayId]["isMatched"] = isMatched;
      tempArray[pokeData.firstPick]["isMatched"] = isMatched;
      setPokeData({
        ...pokeData,
        pokemonList: tempArray,
        firstPick: null,
        matches: count,
        isPaused: false,
      });
    }
  };

  const toggleOpen = async (arrayId: number) => {
    let tempArray = pokeData.pokemonList;
    const firstPick = pokeData.firstPick ? pokeData.firstPick : arrayId;
    const isPaused = pokeData.firstPick ? true : false;
    if (!pokeData.isPaused) {
      tempArray[arrayId]["isOpen"] = true;
      setPokeData({
        ...pokeData,
        pokemonList: tempArray,
        firstPick: firstPick,
        isPaused: isPaused,
      });
    }
    if (pokeData.firstPick !== null && !pokeData.isPaused) {
      setPokeData({
        ...pokeData,
        isPaused: true,
      });
      await checkIsMatched(tempArray, arrayId);
    }
  };

  const handleLogin = async () => {
    try {
      await authProvider.login();
      toast("🦄 Connected Metamask!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      getIndentity();
    } catch (error) {
      toast("🦄 Please run on Metamask!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const handleLogout = async () => {
    await authProvider.logout();
    setIdentity({ address: "", balance: "" });
  };

  const getIndentity = async () => {
    const id = await authProvider.getUserIdentity();
    setIdentity(id);
  };

  return (
    <div className="min-h-screen bg-base-200">
      <ToastContainer />
      <div className="hero pt-1">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <button
              className={`btn glass text-orange-500 ${
                identity?.address && "text-xs"
              } `}
              onClick={() =>
                identity?.address ? handleLogout() : handleLogin()
              }
            >
              {identity?.address || "🦊 Connect with metamask"}
            </button>
            <div className="stats shadow mt-4 ">
              <div className="stat">
                <div className="stat-title">Bonus Point</div>
                <div className="stat-value">0.02</div>
                <div className="stat-actions">
                  <label
                    htmlFor="my-modal-6"
                    className="btn btn-sm btn-success"
                  >
                    Claim
                  </label>
                </div>
              </div>
              <div className="stat">
                <div className="stat-title">Tasks done</div>
                <div className="stat-value">{pokeData.matches}</div>
                <div className="stat-actions">
                  <button
                    className="btn btn-xs btn-error"
                    onClick={() => location.reload()}
                  >
                    Restart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className=" flex justify-center">
        <div className="grid grid-cols-4 gap-3 max-w-md justify-center">
          {pokeData?.pokemonList?.map((pokemon, index) => (
            <div
              className="min-w-[88px] min-h-[88px] card rounder-lg bg-transparent cursor-pointer group perspective flex justify-center align-middle"
              key={index}
              onClick={() => {
                if (!pokemon.isMatched) toggleOpen(index);
              }}
            >
              <div
                className={`relative preserve-3d bg-base-100 rounded-xl  ${
                  pokemon.isOpen && "group-hover:my-rotate-y-180"
                } w-full h-full duration-1000`}
              >
                <div className="absolute backface-hidden border-2 w-full h-full">
                  <div className="card bg-base-100  p-2 md:p-4 shadow-xl transition duration-500 ease-in-out transform hover:translate-x-3 hover:shadow-lg  cursor-pointer">
                    <figure className="w-full h-full">
                      <Image
                        src={
                          "https://www.pngitem.com/pimgs/m/604-6046515_pokeball-pixel-art-png-transparent-png.png"
                        }
                        alt={"Poke Ball Image"}
                        width={150}
                        height={150}
                      />
                    </figure>
                  </div>
                </div>
                <div
                  className={`absolute my-rotate-y-180 rounded-xl ${
                    !pokemon.isOpen && "backface-hidden"
                  } w-full h-full bg-gray-100 overflow-hidden`}
                >
                  <div className="card bg-base-100 p-2 md:p-4 shadow-xl transition duration-500 ease-in-out transform hover:-translate-x-3 hover:shadow-lg  cursor-pointer">
                    <figure className="w-full h-full">
                      <Image
                        src={pokemon?.image}
                        alt={pokemon.name}
                        width={150}
                        height={150}
                      />
                    </figure>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <input type="checkbox" id="my-modal-6" className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Cooming Soon!</h3>
          <p className="py-4">Reward coin will develop as soon as possible!</p>
          <div className="modal-action">
            <label htmlFor="my-modal-6" className="btn">
              Yay!
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
