import { type ChangeEvent, useState, FormEvent } from "react";
import GrowingInput from "../components/GrowingInput";
import { type UrlPattern, type ClientFullHero } from "types";
import { api } from "~/utils/api";

const CreateHero = () => {
  const createHero = api.main.insertHero.useMutation();
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
    createHero.mutate(hero, {
      onSuccess() {
        console.log("Everithing Worked Properly!");
      },
      onError(error) {
        console.error(error);
      },
    });
  };
  const handleImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.value === "") return;
    setHero((prev) => {
      return { ...prev, images: [{ url: e.currentTarget.value }] };
    });
  };
  return (
    <form className="h-screen" onSubmit={(e) => handleSubmit(e)}>
      <div className="flex flex-col items-center gap-5">
        <input
          className="input input-secondary"
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
