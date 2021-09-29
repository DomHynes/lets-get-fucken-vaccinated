// https://nextjs.org/docs/advanced-features/custom-document
// https://stitches.dev/docs/server-side-rendering

import * as React from 'react'
import NextDocument, { Html, Head, Main, NextScript } from 'next/document'
import { getCssString } from '../stitches.config'

export default class Document extends NextDocument {
	static async getInitialProps(ctx: any) {
		try {
			const initialProps = await NextDocument.getInitialProps(ctx)

			return {
				...initialProps,
				styles: (
					<>
						{initialProps.styles}
						{/* Stitches CSS for SSR */}
						<style
							id="stitches"
							dangerouslySetInnerHTML={{ __html: getCssString() }}
						/>
					</>
				),
			}
		} finally {
		}
	}

	render() {
		return (
			<Html lang="en">
				<Head>
					<script
						defer
						data-domain="letsgetfuckenvaccinated.com"
						src="https://plausible.io/js/plausible.js"
					></script>

					<title>let's get fucken VACCINATED</title>
					<meta name="author" content="@domhynes" />

					<meta property="og:title" content="let's get fucken VACCINATED" />
					<meta property="og:type" content="website" />
					<meta
						property="og:url"
						content="https://letsgetfuckenvaccinated.com/"
					/>
					<meta
						property="og:image"
						content="https://letsgetfuckenvaccinated.com/"
					/>

					<meta name="twitter:card" content="summary_large_image" />
					<meta name="twitter:creator" content="@domhynes" />
					<meta name="twitter:title" content="let's get fucken VACCINATED" />
					<meta
						name="twitter:image"
						content="https://letsgetfuckenvaccinated.com/do-i-look-like-i-know-what-a-jpeg-is.png"
					/>
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		)
	}
}
