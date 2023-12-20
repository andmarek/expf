"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Create() {
  const router = useRouter();

  const createButtonText = "Create";

  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function submitForm(e) {
    setIsLoading(true);

    console.log("submitting");
    e.preventDefault();

    try {
      const formData = new FormData(e.currentTarget);
      console.log(formData);
      const response = await fetch("/api/board", {
        method: "PUT",
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        console.log("the data");
        console.log(data);
        router.push(`/board/${formData.get("boardName")}`);
      } else {
        const errorData = await response.json();
        console.error("Server responded with an error: ", errorData);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center">
      <form className="flex flex-col" onSubmit={submitForm}>
        <h1> Enter a title for your retro </h1>
        <div className="flex flex-col">
          <div>
            <label> Title </label>
            <input
              name="boardName"
              className="text-base-black m-2"
              type="text"
              placeholder="Enter a title"
            />
          </div>
          <div> 
            <label> Description </label>
          <input
            name="boardDescription"
            className="text-base-black m-2"
            type="text"
            placeholder="Enter a Description"
          />
        </div>
        </div>
        <button className="bg-transparent hover:bg-blue text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
          {isLoading ? "Loading..." : createButtonText}
        </button>
      </form>
    </div>
  );
}
