import { type ChangeEvent, useState, type FormEvent } from "react";
import GrowingInput from "../components/GrowingInput";
import { type ClientFullHero } from "types";
import { api } from "~/utils/api";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { checkImageAndAllowed} from "~/function";


const CreateHero = () => {
  const [validUrl, setValidUrl] = useState(true);
  const createHero = api.main.insertHero.useMutation();
  const router = useRouter();
  const [hero, setHero] = useState<ClientFullHero>({
    catch_phrase: "",
    nickname: "",
    real_name: "",
    images: [{ url: "" }],
    origin_description: "",
    superpowers: [{ description: "" }],
  });
  const handleInputsChange = (
    e: ChangeEvent<HTMLInputElement>,
    key: keyof ClientFullHero,
  ) => {
    const updatedHeroInfo = { ...hero, [key]: e.currentTarget.value };
    setHero(updatedHeroInfo);
  };
  const handleSuperChange = (superpowers: string[]) => {
    setHero((prev) => {
      const res = {
        ...prev,
        superpowers: superpowers.map((item) => {
          return { description: item };
        }),
      };

      return res;
    });
  };
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validUrl) {
      createHero.mutate(hero, {
        onSuccess() {
          console.log("Everithing Worked Properly!");
          toast.success("Hero created successfully! Redirecting...", {
            autoClose: 3000,
          });
          setTimeout(() => {
            void router.push("/");
          }, 3000);
        },
        onError(error) {
          console.error(error);
        },
      });
    } else {
      toast.error("Invalid Url!");
    }
  };
  const handleImage = (e: ChangeEvent<HTMLInputElement>) => {
    setHero((prev) => {
      return { ...prev, images: [{ url: e.target.value }] };
    });
    if (e.target.value) {
      const isValid = checkImageAndAllowed(e.target.value);
      setValidUrl(isValid);
    }
  };
  return (
    <form className="flex h-screen items-center justify-center" onSubmit={(e) => handleSubmit(e)}>
      <div className="flex flex-col items-center gap-5 card bg-base-300 shadow-xl p-5 shadow-zinc-800">
        <input
          value={hero.images[0]?.url}
          type="text"
          className={`input ${validUrl ? "input-success" : "input-error"}`}
          placeholder="Image URL"
          onChange={(e) => handleImage(e)}
        />
        <input
          className="input input-secondary"
          placeholder="nickname"
          value={hero.nickname}
          onChange={(e) => handleInputsChange(e, "nickname")}
        />
        <input
          className="input input-secondary"
          placeholder="catch_phrase"
          value={hero.catch_phrase}
          onChange={(e) => handleInputsChange(e, "catch_phrase")}
        />
        <input
          className="input input-secondary"
          placeholder="real_name"
          value={hero.real_name}
          onChange={(e) => handleInputsChange(e, "real_name")}
        />
        <input
          className="input input-secondary"
          placeholder="origin_description"
          value={hero.origin_description}
          onChange={(e) => handleInputsChange(e, "origin_description")}
        />

        <GrowingInput
          changeHeroSupers={handleSuperChange}
          defaultValues={hero.superpowers.map((item) => item.description)}
        />
        <button className="btn btn-secondary" type="submit">
          Create Hero!
        </button>
      </div>
    </form>
  );
};
export default CreateHero;
