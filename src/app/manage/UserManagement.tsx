"use client"
import addUser from "@/backend/addUser"
import getUsers from "@/backend/getUsers"
import DeleteButton from "@/components/buttons/DeleteButton"
import WhiteTextButton from "@/components/buttons/whitebutton"
import { User } from "@/types/User"
import { useEffect, useState } from "react"

export default function UserManagement () {

    const [users, setUsers] = useState<Array<User>>([])

    useEffect( () => {
        getUsers(
        ).then( (response) => {
            setUsers(response)
        })
    }, [])

    return <div id="user-management">
        <h2 className="section-title">
            Manage Users
        </h2>
        <UserAdder/>
        <UserTable users={users}/>
    </div>
}

function UserAdder () {

    const [errorText, setErrorText] = useState<string>("")

    return <form onSubmit={async (event) => {
        event.preventDefault()
        let formData = new FormData(event.currentTarget)
        let message = await addUser(formData.get("username")?.toString() ?? "",
            formData.get("password")?.toString() ?? "",
            formData.get("isAdmin") === "on"
        )
        if (message != "") {
            setErrorText(message)
        } else {
            window.location.href = "."
        }
    }}>
        <table id="user-adder">
            <thead>
                <tr>
                    <th colSpan={2} className="section-title">
                        Add a new user
                    </th>  
                </tr>
                
            </thead>
            <tbody>
                <tr>
                    <td>
                        Username
                    </td>
                    <td>
                        Password
                    </td>
                </tr>
                <tr>
                    <td>
                        <input type="text" name="username"/>
                    </td>
                    <td>
                        <input type="password" name="password"/>
                    </td>
                </tr>
                <tr>
                    <td>
                        <input type="checkbox" name="isAdmin"/>
                        &nbsp;This user is an admin
                    </td>
                    <td>
                        <WhiteTextButton text="Add" submit={true}/>
                    </td>
                </tr>
                <tr>
                    <td colSpan={2} className="error-text">
                        {errorText}
                    </td>
                </tr>
            </tbody>
        </table>
    </form>
}

interface UserTableProps {
    users: Array<User>
}

function UserTable ({users}: UserTableProps) {

    let userTableEntries = users.map( (user) => <tr key={user.username}>
        <td>
            {user.username}
        </td>
        <td>
            {user.isAdmin ? "yes" : ""}
        </td>
        <td>
            {user.dateCreated.toLocaleDateString()}
        </td>
        <td>
            {user.lastLogin.toLocaleDateString()}
        </td>
        <td>
            <DeleteButton onClick={() => {}}/>
        </td>
    </tr>)

    return <table id="user-table">
        <thead >
            <tr>
                <th>
                    Username
                </th>
                <th>
                    Admin
                </th>
                <th>
                    Created
                </th>
                <th>
                    Last Login
                </th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            {userTableEntries}
        </tbody>
    </table>
}