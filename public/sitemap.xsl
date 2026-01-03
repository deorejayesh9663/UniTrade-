<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" 
                xmlns:html="http://www.w3.org/TR/REC-html40"
                xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
    <xsl:template match="/">
        <html xmlns="http://www.w3.org/1999/xhtml">
            <head>
                <title>XML Sitemap - UniTrade</title>
                <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                <style type="text/css">
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                        color: #f3f4f6;
                        background: #0f172a;
                        margin: 0;
                        padding: 40px;
                    }
                    .container {
                        max-width: 1000px;
                        margin: 0 auto;
                        background: rgba(255, 255, 255, 0.03);
                        backdrop-filter: blur(12px);
                        border: 1px solid rgba(255, 255, 255, 0.1);
                        border-radius: 20px;
                        padding: 40px;
                        box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                    }
                    h1 {
                        color: #fff;
                        margin-bottom: 20px;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                    }
                    h1 span {
                        color: #a855f7;
                    }
                    p {
                        color: #9ca3af;
                        margin-bottom: 30px;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 20px;
                    }
                    th {
                        text-align: left;
                        padding: 15px;
                        background: rgba(168, 85, 247, 0.1);
                        color: #a855f7;
                        border-bottom: 2px solid rgba(168, 85, 247, 0.2);
                    }
                    td {
                        padding: 15px;
                        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                    }
                    tr:hover td {
                        background: rgba(255, 255, 255, 0.02);
                    }
                    a {
                        color: #e5e7eb;
                        text-decoration: none;
                        transition: color 0.2s;
                    }
                    a:hover {
                        color: #a855f7;
                    }
                    .priority {
                        display: inline-block;
                        padding: 2px 8px;
                        background: rgba(168, 85, 247, 0.2);
                        color: #a855f7;
                        border-radius: 4px;
                        font-size: 12px;
                        font-weight: bold;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Uni<span>Trade</span> Sitemap</h1>
                    <p>This is an XML Sitemap, meant for consumption by search engines like Google. It contains <xsl:value-of select="count(sitemap:urlset/sitemap:url)"/> URLs.</p>
                    <table>
                        <thead>
                            <tr>
                                <th>URL</th>
                                <th>Priority</th>
                                <th>Change Freq.</th>
                                <th>Last Modified</th>
                            </tr>
                        </thead>
                        <tbody>
                            <xsl:for-each select="sitemap:urlset/sitemap:url">
                                <tr>
                                    <td>
                                        <xsl:variable name="itemURL">
                                            <xsl:value-of select="sitemap:loc"/>
                                        </xsl:variable>
                                        <a href="{$itemURL}"><xsl:value-of select="sitemap:loc"/></a>
                                    </td>
                                    <td><span class="priority"><xsl:value-of select="sitemap:priority"/></span></td>
                                    <td><xsl:value-of select="sitemap:changefreq"/></td>
                                    <td><xsl:value-of select="sitemap:lastmod"/></td>
                                </tr>
                            </xsl:for-each>
                        </tbody>
                    </table>
                </div>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>
