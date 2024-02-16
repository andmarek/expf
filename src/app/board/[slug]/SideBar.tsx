import { Switch, TextField } from "@radix-ui/themes";

export default function SideBar({ switchPasswordRequired, switchBlurCardText }) {
  return (
    <div className="w-full bg-base-50">
      <h1> Blur card text </h1>
      <Switch onClick={switchBlurCardText} />
      <h1> Lock Board with Password </h1>
      <Switch onClick={switchPasswordRequired} />
      <TextField.Input placeholder="Enter a password" />
    </div>
  )
}
