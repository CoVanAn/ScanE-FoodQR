import { Car } from "lucide-react";
import DashboardMain from "./dashboard-main";
import { Card, CardTitle, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import socket from "@/lib/socket";

export default async function Dashboard() {
  // socket.connect()
  // console.log("Dashboard socket connected", socket.connected);
  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="space-y-2">
        <Card>
          <CardHeader>
            <CardTitle>Dashboard</CardTitle>
            <CardDescription>Phân tích các chỉ số</CardDescription>
          </CardHeader>
          <CardContent>
            <DashboardMain />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}