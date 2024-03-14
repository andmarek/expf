"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Cross1Icon } from "@radix-ui/react-icons";

const initialTemplate = "Classic";

const classicTemplate = [
  { columnName: "What went well?" },
  { columnName: "What went wrong?" },
  { columnName: "items?" },
]
const twoColumnTemplate = [
  { columnName: "What went well?" },
  { columnName: "What went wrong?" },
]

const testingTemplate = [
  { columnName: "Test1" },
  { columnName: "Test2" },
]

const templateOptions = {
  "Classic": classicTemplate,
  "Two Column": twoColumnTemplate,
  "Testing": testingTemplate,
};



export default function CreateBoard() {
  const [boardName, setBoardName] = useState("");
  const [boardDescription, setBoardDescription] = useState("");
  const [requireBoardPassword, setRequireBoardPassword] = useState("");
  const [boardColumns, setBoardColumns] = useState(templateOptions[initialTemplate]);
  const [columnCount, setColumnCount] = useState(boardColumns.length);
  const [selectedTemplate, setSelectedTemplate] = useState("Classic");

  const router = useRouter();

  async function submitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const boardId = "test";

    try {
      const response = await fetch("/api/board", {
        method: "PUT",
        body: JSON.stringify({
          boardId,
          boardName,
          boardDescription,
          requireBoardPassword
        }),
        headers: {
          "Content-Type": "application/json"
        },
      });

      const responseBodyJson = await response.json();

      if (response.ok) {
        router.push(`board/${boardId}`)
      } else {
        console.log("Server responded with an error: ", responseBodyJson);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  function addColumn() {
    setColumnCount(columnCount + 1);
    setBoardColumns(prevBoardColumns => [...prevBoardColumns, { columnName: "" }])
  }

  function handleTemplateSelection(templateToSelect: string) {
    setSelectedTemplate(templateToSelect);
    setBoardColumns(templateOptions[templateToSelect]);
    setColumnCount(templateOptions[templateToSelect].length);
  }

  function changeColumnName(text: string, key: number) {
    setBoardColumns(prevBoardColumns => {
      const newBoardColumns = [...prevBoardColumns];
      newBoardColumns[key].columnName = text;
      console.log(newBoardColumns);
      return newBoardColumns;
    })
  }

  function removeColumn(key: number) {
    setColumnCount(columnCount - 1);
    setBoardColumns(prevBoardColumns => {
      const newBoardColumns = [...prevBoardColumns];
      newBoardColumns.splice(key, 1);
      return newBoardColumns;
    })
  }

  return (
    <div>
      <form className="flex flex-col" onSubmit={submitForm}>
        <label>
          Board Name: <input name="boardName" defaultValue="Some initial value" />
        </label>
        <label>
          Board Description: <input name="boardDescription" defaultValue="Some initial value" />
        </label>
        <hr />
        <p>
          Columns:
        </p>
        <label><input type="radio" name="myRadio" value="option1" defaultChecked={true} /> I want to use a template (preconfigured columns) </label>
        <label><input type="radio" name="myRadio" value="option1" /> I want my own custom columns </label>
        <hr />
        <label>
          Template Selection:
          <select value={selectedTemplate} onChange={(e) => handleTemplateSelection(e.target.value)}>
            <option value="Classic">Classic Retrospective</option>
            <option value="Two Column">Two Column</option>
            <option value="Testing">Testing</option>
          </select>
        </label>
        <hr />
        <label>
          Current Columns
        </label>
        <ul>
          {boardColumns.map((column, index) => (
            <li key={index} className="flex flex-row">
              <input name={`column-${index}`} onChange={(e) => changeColumnName(e.target.value, index)} defaultValue={column.columnName} />
              <Cross1Icon onClick={() => removeColumn(index)} />
            </li>
          )
          )}
        </ul>
        <p> {columnCount} </p>
        <div>
        </div>
        <button type="button" onClick={addColumn}> Add </button>
      </form>
    </div>
  )

}
