import { FC } from "react";
import { type FullHero } from "types";
const OnNoEdit: FC<{ HeroInfo: FullHero }> = ({ HeroInfo }) => {
  if (!HeroInfo) return null;
  return (
    <div className="card mt-4 w-96 bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-white">Hero Description</h2>
        <p>
          <b>Hero nickname: </b>
          {HeroInfo.nickname}
        </p>
        <p>
          <b>Hero real name: </b>
          {HeroInfo.real_name}
        </p>
        <p>
          <b>Hero catch phrase: </b>
          {HeroInfo.catch_phrase}
        </p>
        <p>
          <b>Hero description: </b>
          <p>{HeroInfo.origin_description}</p>
        </p>
        <p>
          <b>Hero SuperPowers: </b>
          {HeroInfo.superpowers
            .map((superpower) => {
              return superpower.description;
            })
            .join(", ")}
        </p>
      </div>
    </div>
  );
};
export default OnNoEdit;
