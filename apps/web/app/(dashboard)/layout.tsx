import React from 'react';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div>
            {/* You can add sidebar, header etc. here */}
            <main>{children}</main>
        </div>
    );
}
