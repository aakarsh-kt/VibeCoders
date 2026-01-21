import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { navigate } from "../../lib/router";

export function LoggedOutCard(props: { title?: string; description?: string }) {
    return (
        <Card className="bg-card/30 backdrop-blur">
            <CardHeader>
                <CardTitle>{props.title ?? "You’re not logged in"}</CardTitle>
                <CardDescription>{props.description ?? "Log in to continue."}</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-2">
                <Button onClick={() => navigate("/login")}>Log in</Button>
                <Button variant="secondary" onClick={() => navigate("/signup")}>Sign up</Button>
            </CardContent>
        </Card>
    );
}
