import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";

export function LoadingState() {
  return (
    <Card className="w-full">
      <CardContent className="flex flex-col items-center justify-center p-8 space-y-6">
        <div className="w-full max-w-xl space-y-4">
          <Progress value={33} className="w-full h-2" />
          <div className="text-center space-y-2">
            <h3 className="text-lg font-medium">Generating your course...</h3>
            <p className="text-sm text-muted-foreground">
              Miss Nova is crafting a personalized learning experience for you
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
