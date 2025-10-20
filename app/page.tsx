import Component from "@/job-posting-cards"
import { LeftMenu } from "@/components/left-menu"

export default function Page({ searchParams }: { searchParams?: { dataset?: string } }) {
  const dataset = searchParams?.dataset
  return (
    <div className="flex flex-row pl-[0px] xl:pl-[140px]">
      <LeftMenu />
      <div className="flex flex-col w-full">
        <Component dataset={dataset} />
      </div>
    </div>
  )
}

