import { type FullHero } from "types";
import Image from "next/image";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { ChangeEvent, FC, useState } from "react";

const HeroPage = () => {
  const router = useRouter();
  const { hero } = router.query;
  const ParsedHero: FullHero = JSON.parse(hero as string) as FullHero;
  const [HeroInfo, setHeroInfo] = useState<FullHero>(ParsedHero);
  const [edit, setEdit] = useState(false);
  const deleteHero = api.main.deleteSuperhero.useMutation();
  const handleDelete = (id: number) => {
    deleteHero.mutate(id, {
      onError(error, variables, context) {
        console.error(error);
      },
      onSuccess(data, variables, context) {
        console.log("Success on deleting!");
        void router.push("/");
      },
    });
  };
  const handleChange = (
    field: keyof FullHero,
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    const updatedHeroInfo = { ...HeroInfo, [field]: e.currentTarget.value };
    setHeroInfo(updatedHeroInfo);
  };
  const handleAddImage = (url: string) => {
    setHeroInfo({
      ...HeroInfo,
      images: [...HeroInfo.images, { url, superheroId: HeroInfo.id, id: 0 }],
    });
  };
  const handleDeleteImage = (index_to_delete: number) => {
    setHeroInfo({
      ...HeroInfo,
      images: HeroInfo.images.filter((image, index) => {
        return index !== index_to_delete;
      }),
    });
  };
  return (
    <div className="flex flex-col content-center">
      <div className="carousel carousel-center pt-4">
        {HeroInfo.images.map((image, index) => (
          <div className="carousel-item" key={image.id}>
            <div
              className="card indicator w-96 bg-base-300 shadow-xl "
              key={image.id}
            >
              {/* <span className="indicator-item badge badge-secondary"></span> */}
              <figure>
                <Image
                  height={250}
                  width={250}
                  src={image.url}
                  alt="Shoes"
                  sizes="100vw"
                  className="h-auto w-full overflow-x-scroll"
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title text-center">{HeroInfo.nickname}</h2>
              </div>
              <span
                onClick={() => handleDeleteImage(index)}
                className={`circle badge indicator-item badge-secondary ${
                  edit ? "visible" : "hidden"
                }`}
              >
                &#10005;
              </span>
            </div>
            {HeroInfo.images.length - 1 === index ? null : (
              <div className="divider divider-horizontal"></div>
            )}
          </div>
        ))}
      </div>
      {edit ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1}
          stroke="currentColor"
          className="h-24 w-24 animate-pulse fill-success hover:cursor-pointer"
          onClick={() => handleAddImage}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ) : null}
      <div className="flex w-full flex-col items-center">
        {edit ? (
          <div className="card mt-4 w-96 bg-base-100">
            <div className="card-body">
              <h2 className="card-title text-white">Hero Description</h2>
              <p>
                <b>Hero nickname: </b>
                {/* {HeroInfo.nickname} */}
                <input
                  onChange={(e) => handleChange("nickname", e)}
                  type="text"
                  placeholder="Type here"
                  className="input input-bordered input-secondary w-full max-w-xs"
                  value={HeroInfo.nickname}
                />
              </p>
              <p>
                <b>Hero real name: </b>
                <input
                  onChange={(e) => handleChange("real_name", e)}
                  type="text"
                  placeholder="Type here"
                  className="input input-bordered input-secondary w-full max-w-xs"
                  value={HeroInfo.real_name}
                />
                {/* {HeroInfo.real_name} */}
              </p>
              <p>
                <b>Hero catch phrase: </b>
                <input
                  onChange={(e) => handleChange("catch_phrase", e)}
                  type="text"
                  placeholder="Type here"
                  className="input input-bordered input-secondary w-full max-w-xs"
                  value={HeroInfo.catch_phrase}
                />
                {/* {HeroInfo.catch_phrase} */}
              </p>
              <p>
                <b>Hero description: </b>
                <input
                  onChange={(e) => handleChange("origin_description", e)}
                  type="text"
                  placeholder="Type here"
                  className="input input-bordered input-secondary w-full max-w-xs"
                  value={HeroInfo.origin_description}
                />
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
        ) : (
          <OnNoEdit HeroInfo={HeroInfo} />
        )}
        <div className="flex pt-4">
          {edit ? (
            <div className="flex">
              <button className="btn btn-primary">Save Changes!</button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setHeroInfo(ParsedHero);
                  setEdit(false);
                }}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              className="btn btn-primary mr-2"
              onClick={() => setEdit(true)}
            >
              Edit
            </button>
          )}

          {/* Open the modal using document.getElementById('ID').showModal() method */}
          <button
            className="btn"
            onClick={() =>
              (
                document.getElementById("my_modal_1") as HTMLDialogElement
              )?.showModal()
            }
          >
            Delete
          </button>
          <dialog id="my_modal_1" className="modal">
            <div className="modal-box">
              <h3 className="text-lg font-bold">Delete this Hero?</h3>
              <p className="py-4">
                Press ESC key or click the button below to Cancel
              </p>
              <div className="modal-action">
                <form method="dialog" className="flex w-full justify-between">
                  <button
                    className="btn btn-error"
                    onClick={() => handleDelete(HeroInfo.id)}
                  >
                    Confirm
                  </button>
                  {/* if there is a button in form, it will close the modal */}
                  <button className="btn btn-info">Cancel</button>
                </form>
              </div>
            </div>
          </dialog>
        </div>
      </div>
    </div>
  );
};
const OnNoEdit: FC<{ HeroInfo: FullHero }> = ({ HeroInfo }) => {
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
export default HeroPage;