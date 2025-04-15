import {memo, useEffect } from "react"

function TableContent({data})
{
    if(data === null || data.length === 0 )
    {
        return (
            <>
                <tr colSpan={data.length}>
                    <td>Result not found</td>
                </tr>
            </>
        )
    }
    else
    {
        return (
            <>
                {[...Array(Object.values(data)[0].length).keys()].map(i=>(
                    <tr>
                        <td>{i+1}</td>
                        {Object.keys(data).map(key=>(
                            <td key={"col"+key+i}>
                                {data[key][i]}
                            </td>
                        ))}
                    </tr>
                ))}
            </>
        )
    }
}
function TableHeader({data})
{
    if(data.length===0)
    {
        return (
            <>
            <tr>
                <th>Header</th>
            </tr>
            </>
        )
    }
    else
    {
        return (
            <tr>
                <th></th>
                {Object.keys(data).map(key=>(
                    <th key={key}>
                        {key}
                    </th>
                ))}
            </tr>
        )
    }
}
const ResultTable=memo(({data})=>
{
    useEffect(()=>{console.log("Table Rerendered")})
    return (
        <>
        <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
            <table className="table table-sm">
                <thead>
                    <TableHeader data={data} />
                </thead>
                <tbody>
                    <TableContent data={data} />
                </tbody>
            </table>
        </div>
        </>
    )
})
export default ResultTable