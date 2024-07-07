import moment from "moment";
import React from "react";

interface UrlEntry {
    id: number;
    dateCreated: string;
    originalUrl: string;
    shortenedUrl: string;
    ip: string;
}

interface RowProps {
    url: UrlEntry;
}

const Row: React.FC<RowProps> = ({ url }) => {

    const redirectToUrl = () => {
        window.open(url.originalUrl, '_blank', 'noopener,noreferrer');
    };

    return (
        <tr key={url.id}>
            <td>{moment(url.dateCreated).format("DD/MM/YYYY")}</td>
            <td>{url.originalUrl}</td>
            <td>{url.shortenedUrl}</td>
            <td>{url.ip}</td>
            <td>
                <button className="btn btn-success btn-sm" onClick={redirectToUrl} style={{ cursor: 'pointer' }}>Visit</button>
            </td>
        </tr>
    )
}

export default Row;