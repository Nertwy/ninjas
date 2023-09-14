import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { api } from "~/utils/api";

import Pagination from "./components/Pagination";
import { useRouter } from "next/router";

export default function Home() {
  const { data, isFetched } = api.main.getSuperhero.useQuery(undefined, {
    refetchInterval: false,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  if (!data)
    return <span className="loading loading-spinner loading-lg"></span>;
  const filteredData = data;
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="flex flex-row">
        {filteredData.slice(currentPage, currentPage + 5).map((item) => (
          <div
            className="card w-96 bg-base-100 shadow-xl"
            key={item.id}
            onClick={() => {
              void router.push({
                pathname: "SuperHero",
                query: { hero: JSON.stringify(item) },
              });
            }}
          >
            <figure>
              <Image
                height={250}
                width={250}
                src={item.images ? item.images[3]?.url ?? "" : ""}
                alt="Shoes"
                sizes="100vw"
                className="h-auto w-full"
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title text-center">{item.nickname}</h2>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-row">
        <Pagination
          currentPage={currentPage}
          onPageChange={(page) => setCurrentPage(page)}
          totalPages={data.length - 5}
          maxVisiblePages={5}
          ellipsisSymbol={"..."}
        />
      </div>
    </div>
  );
}
