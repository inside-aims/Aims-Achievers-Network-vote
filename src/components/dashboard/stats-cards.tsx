import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, Trophy, Eye } from "lucide-react";
import type { Nomineee } from "@/lib/types";

interface StatsCardsProps {
  nominees: Nomineee[];
  activeCategories: number;
}

export function StatsCards({ nominees, activeCategories }: StatsCardsProps) {
  console.log("nominees ", nominees)
  const totalVotes = nominees.reduce(
    (sum, nominee) => sum + nominee.totalVotes,
    0
  );
  const totalAmount = nominees.reduce(
    (sum, nominee) => sum + nominee.totalAmount,
    0
  );

  // after paystack 1.95%
  //paystack amount
  const paystackAmount = totalAmount * 0.02;

  // round it up
  const totalAmountAfterPaystack = Math.ceil(totalAmount - paystackAmount - 1100 );
  
  const totalNominees = nominees.length;
  const leadingNominee = nominees[0];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-zinc-400">
            Total Votes
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-yellow-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-400">
            {totalVotes.toLocaleString()}
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            <span className="text-green-400">+12%</span> from last hour
          </p>
        </CardContent>
      </Card>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-zinc-400">
            Total Amount (500 GHS already deducted)
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-yellow-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-400">
            {totalAmountAfterPaystack.toLocaleString()}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-zinc-400">
            Total Nominees
          </CardTitle>
          <Users className="h-4 w-4 text-yellow-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-400">
            {totalNominees}
          </div>
          <p className="text-xs text-zinc-500 mt-1">Across {activeCategories} categories</p>
        </CardContent>
      </Card>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-zinc-400">
            Leading Nominee
          </CardTitle>
          <Trophy className="h-4 w-4 text-yellow-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-400">
            {leadingNominee?.name}
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            {leadingNominee?.totalVotes} votes
          </p>
        </CardContent>
      </Card>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-zinc-400">
            Live Status
          </CardTitle>
          <Eye className="h-4 w-4 text-green-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-400">LIVE</div>
          <p className="text-xs text-zinc-500 mt-1">Real-time updates</p>
        </CardContent>
      </Card>
    </div>
  );
}
