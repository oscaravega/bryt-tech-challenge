"use client";

import {
  createContext,
  useState,
  useContext,
  type ReactNode,
  type ComponentPropsWithRef,
} from "react";

type NameInputImpl = [string, (name: string) => void];

const NameInputContext = createContext<NameInputImpl>(["", () => { }]);
const useNameInput = () => {
  const context = useContext(NameInputContext);

  if (!context) {
    throw new Error("useNameInput must be used within a NameInputRoot");
  }

  return context;
};

type NameInputRootProps = {
  children: ReactNode;
  initialValue?: string;
};
export const NameInputRoot = ({
  children,
  initialValue,
}: NameInputRootProps) => {
  const [name, setName] = useState(initialValue || "");

  return (
    <NameInputContext.Provider value={[name, setName]}>
      {children}
    </NameInputContext.Provider>
  );
};

type NameInputProps = Omit<
  ComponentPropsWithRef<"input">,
  "value" | "onChange"
>;

export const NameInput = ({ children, ...props }: NameInputProps) => {
  const [name, setName] = useNameInput();

  return (
    <input {...props} value={name} onChange={(e) => setName(e.target.value)} />
  );
};

type NameDisplayProps = {};
export const NameDisplay = (_: NameDisplayProps) => {
  const [name] = useNameInput();
  return name;
};
