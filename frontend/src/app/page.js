import { AlertDialog } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
export default function Home() {
  return (
    <>
    <Button>Click me</Button>
    <Checkbox id="accept" name="accept" value="yes" />
    <Card>Card</Card>
    <Input type="email" placeholder="Email" />
    <Card className="bg-red-500 text-white">Card</Card>
    <Textarea placeholder="Type your message here." />
    <AlertDialog/>
    </>
  );
}
