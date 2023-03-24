import Select from "react-select";

const options = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
];

export const BoardSizeSelector = () => {
  return (
    <div>
      <Select
        options={options}
        styles={{ container: (base, state) => ({ ...base, width: 250 }) }}
      />
    </div>
  );
};
