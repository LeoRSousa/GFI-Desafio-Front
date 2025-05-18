'use client';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import NavBarHeader from "../ui/navBarHeader";
import { Button, Divider, Skeleton, Typography } from "@mui/material";
import GeneralBody from "../ui/generalBody";
import { User } from "../customTypes/User";
import ProfileCards from "../ui/profileCards";
import GeneralTitle from "../ui/generalTitle";
import InvestmentTable from "../ui/investmentTable";
import InvestmentChart from "../ui/investmentChart";

export default function Profile() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const token = Cookies.get("token");
        const user_id = Cookies.get("user_id");
        if (!token) {
            router.push("/login");
        }

        //Chama a requisição da API
        const fetchUser = async () => {
            const myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${token}`);

            const requestOptions = {
                method: "GET",
                headers: myHeaders
            };

            const response = await fetch(`http://localhost:8080/user/${user_id}`, requestOptions);
            const userJson: User = await response.json();
            setUser(userJson);
        };

        fetchUser();
    }, []);

    const emptyInvestments = () => {
        return (
            <div>
                <Typography variant="h6">Parece que não há investimentos</Typography>
                <Button variant="text" color="secondary" onClick={() => {
                    router.push("/profile/investment/new");
                }}>Criar investimento</Button>
            </div>
        );
    }

    const handlerRender = () => {
        if (!user) {
            return (
                <>
                    <Skeleton variant="text" width={200} height={40} />
                    <Skeleton variant="rectangular" height={100} sx={{ my: 2 }} />
                    <Skeleton variant="text" width={150} height={30} />
                    <Skeleton variant="rectangular" height={200} sx={{ my: 2 }} />
                </>
            );
        } else {
            return <div>
                <div id="investment-list">
                    <GeneralTitle>INVESTIMENTOS</GeneralTitle>
                    <ProfileCards>
                        {user?.investments.length === 0
                            ? emptyInvestments()
                            : <div>
                                <InvestmentTable investments={user?.investments || []}/>
                                <Button variant="text" color="secondary" onClick={() => {
                                    router.push("/profile/investment/new");
                                }}>Criar investimento</Button>
                            </div>
                        }
                    </ProfileCards>
                </div>
                <Divider sx={{ my: 4 }} />
                <div id="investment-chart">
                    <GeneralTitle>GRÁFICO DE INVESTIMENTOS POR TIPOS</GeneralTitle>
                    <ProfileCards>
                        {user?.investments.length === 0
                            ? emptyInvestments()
                            : <InvestmentChart investments={user?.investments}/>
                        }
                    </ProfileCards>
                </div>
            </div>
        }
    }

    return (
        <div>
            <NavBarHeader />
            <GeneralBody>
                {handlerRender()}
            </GeneralBody>
        </div>
    );
}