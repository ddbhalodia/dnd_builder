// These will be available from the sidebar
export const fields = [
  {
    type: "input",
    title: "Text Input"
  },
  {
    type: "select",
    title: "Select"
  },
  {
    type: "text",
    title: "Text"
  },
  {
    type: "button",
    title: "Button"
  },
  {
    type: "textarea",
    title: "Text Area"
  }
];

// These define how we render the field
export const renderers = {
  input: () => (<div className="w-full relative"><input className="w-full" type="text" placeholder="This is a text input" /><img onClick={() => console.log("+++")} className="absolute right-0 top-0" src={''} alt="" /> </div>),
  textarea: () => (<div className="w-full relative"><textarea className="w-full" rows={5} /><img className="absolute right-0 top-0" src={''} alt="" /></div>),
  select: () => (
    <div className="w-full relative">
      <select className="w-full">
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
      </select>
      <img className="absolute right-0 top-0" src={''} alt="" />
    </div>
  ),
  text: () => (
    <div className="w-full relative">
      <p className="w-full">
        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
        Lorem Ipsum has been the industry's standard dummy text ever since the
        1500s, when an unknown printer took a galley of type and scrambled it to
        make a type specimen book. It has survived not only five centuries, but
        also the leap into electronic typesetting, remaining essentially
        unchanged. It was popularised in the 1960s with the release of Letraset
        sheets containing Lorem Ipsum passages, and more recently with desktop
        publishing software like Aldus PageMaker including versions of Lorem
        Ipsum.
      </p>
      <img className="absolute right-0 top-0" src={''} alt="" />
    </div>
  ),
  button: () => (<div className="relative w-full">
    <button className="w-full">Button</button>
    <img className="absolute right-0 top-0" src={''} alt="" />
  </div>
  )
};