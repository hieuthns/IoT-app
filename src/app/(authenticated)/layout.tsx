import { Header } from "@/components/layout/Header";

interface Props {
  children: React.ReactNode;
}

const layout: React.FC<Props> = ({ children }) => {
  return (
    <div className="">
      <Header />
      {children}
    </div>
  )
}

export default layout;