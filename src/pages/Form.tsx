import { useState, ChangeEvent, FormEvent } from "react";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB


const Form = ()=>{
    const [file, setFile] = useState<File | null>(null);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > MAX_FILE_SIZE) {
        setFile(null);
      }
      setFile(file);
    }
  };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;
    try {
      const data = new FormData();
      data.set("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });
      // handle the error
      if (!res.ok) throw new Error(await res.text());
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <form onSubmit={(e) => void handleSubmit(e)}>
        <input
          type="file"
          onChange={(e) => handleChange(e)}
          accept=".jpg, .jpeg, .png, .gif"
        />
        <button type="submit">submit</button>
      </form>
    </>
  );
}