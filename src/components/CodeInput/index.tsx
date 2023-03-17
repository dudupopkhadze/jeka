import "./CodeInput.css";
import { useCodeController } from "../../hooks";

export const CodeInput = () => {
  const { codeInputRef } = useCodeController();

  return <div className="CodeInput-Container" ref={codeInputRef} />;
};
