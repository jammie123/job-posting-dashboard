import { JobListLineManager } from "@/components/job-list-line-manager"
import { LeftMenu } from "@/components/left-menu"
import { TopHeader } from "@/components/top-header"

export default function JobListLineManagerPage() {
  return (
    <div className="flex flex-row pl-[0px] xl:pl-[140px]">
      <LeftMenu />
      <div className="flex flex-col w-full">
        <TopHeader userName="Anna K." companyName="Acme Corporation" />
        <JobListLineManager />
      </div>
    </div>
  )
}

