import { type FullHero } from "types";
import Image from "next/image";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { type ChangeEvent, useEffect, useState } from "react";
import OnNoEdit from "./OnNoEdit";
import { type NextPage } from "next";
import GrowingInput from "../components/GrowingInput";

const HeroPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const updateHero = api.main.updateHero.useMutation();
  const [edit, setEdit] = useState(false);
  const { data, isFetched, refetch } = api.main.getHeroById.useQuery(
    parseInt(id as string),
  );
  const [HeroInfo, setHeroInfo] = useState<FullHero>(
    data ?? {
      id: 0,
      catch_phrase: "",
      images: [],
      nickname: "",
      origin_description: "",
      real_name: "",
      superpowers: [],
    },
  );
  const [imageUrl, setImageUrl] = useState<string>("");
  useEffect(() => {
    setHeroInfo((prev) => data ?? prev);
  }, [isFetched]);

  const deleteHero = api.main.deleteSuperhero.useMutation();
  const handleDelete = (id: number) => {
    deleteHero.mutate(id, {
      onError(error) {
        console.error(error);
      },
      onSuccess() {
        console.log("Success on deleting!");
        void router.push("/");
      },
    });
  };
  const handleSuperChange = (superpowers: string[]) => {
    setHeroInfo((prev) => {
      const res = {
        ...prev,
        superpowers: superpowers.map((item) => {
          return { description: item, superheroId: prev.id, id: -1 };
        }),
      };

      return res;
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
    setHeroInfo((prev) => {
      return {
        ...prev,
        images: [...HeroInfo.images, { url, superheroId: HeroInfo.id, id: 0 }],
      };
    });
  };
  const handleDeleteImage = (index_to_delete: number) => {
    setHeroInfo((prev) => {
      return {
        ...prev,
        images: HeroInfo.images.filter((image, index) => {
          return index !== index_to_delete;
        }),
      };
    });
  };
  const handleHeroUpdate = () => {
    updateHero.mutate(HeroInfo, {
      onSuccess() {
        void refetch();
      },
      onError(error) {
        console.error(error);
      },
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
        {edit ? (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1}
              stroke="currentColor"
              className="flex h-24 w-24 animate-pulse self-center fill-success hover:cursor-pointer"
              onClick={() =>
                (
                  document.getElementById("my_modal_2") as HTMLDialogElement
                )?.showModal()
              }
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <dialog id="my_modal_2" className="modal">
              <div className="modal-box">
                <h3 className="text-lg font-bold">Add image!</h3>
                <div className="join">
                  <input
                    className="join-item"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.currentTarget.value)}
                  />
                  <button
                    className="btn btn-success join-item"
                    onClick={() => handleAddImage(imageUrl)}
                  >
                    Submit
                  </button>
                </div>
                <p className="py-4">Press ESC key or click outside to close</p>
              </div>
              <form method="dialog" className="modal-backdrop">
                <button>close</button>
              </form>
            </dialog>
          </>
        ) : null}
      </div>

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
                <GrowingInput
                  changeHeroSupers={handleSuperChange}
                  defaultValues={HeroInfo.superpowers.map(
                    (item) => item.description,
                  )}
                />
              </p>
            </div>
          </div>
        ) : (
          <OnNoEdit HeroInfo={HeroInfo} />
        )}
        <div className="flex pt-4">
          {edit ? (
            <div className="flex">
              <button
                type="submit"
                className="btn btn-primary"
                onClick={() => {
                  setEdit(false);
                  handleHeroUpdate();
                }}
              >
                Save Changes!
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setHeroInfo(data ?? HeroInfo);
                  setEdit(false);
                  void refetch();
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

export default HeroPage;
