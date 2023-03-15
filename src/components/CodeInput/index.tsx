import "./CodeInput.css";
import { useCodeControllerContext } from "../../hooks";

export const CodeInput = () => {
  const { codeInputRef } = useCodeControllerContext();

  return <div className="CodeInput-Container" ref={codeInputRef} />;
};
