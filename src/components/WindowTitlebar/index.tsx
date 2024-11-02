import { FC, PropsWithChildren } from "react";
import "./index.scss";

export const WindowTitlebar: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div data-tauri-drag-region className="window-titlebar">
      {children}
    </div>
  );
};
