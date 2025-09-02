"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"

const AboutPage = () => {
	const [open, setOpen] = useState(false)

	return (
		<div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white">
			<div className="max-w-5xl mx-auto px-4 py-16">
				<h1 className="text-4xl font-bold text-emerald-700 mb-4">About PharmaCare</h1>
				<p className="text-lg text-gray-700 mb-8">PharmaCare is a curated online pharmacy focused on safe, reliable medication delivery and easy prescription management. We combine licensed supply chains with fast, friendly delivery so customers receive the care they need.</p>

				{/* Founder / Mission Section (circular image) */}
				<div className="bg-white rounded-lg shadow p-6 flex flex-col md:flex-row items-center gap-6">
					<button
						onClick={() => setOpen(true)}
						className="flex-shrink-0 h-40 w-40 rounded-full overflow-hidden ring-2 ring-emerald-100 hover:ring-emerald-200 focus:outline-none"
						aria-label="View founder"
					>
						<Image src="/JOHN OITO.jpg" alt="John Oito" width={160} height={160} className="object-cover h-full w-full" />
					</button>

					<div>
						<h2 className="text-2xl font-semibold text-emerald-700">Our Founder — John Oito</h2>
						<p className="mt-2 text-gray-700">John founded PharmaCare to make essential medicines more accessible. With years of experience in healthcare logistics and a commitment to patient safety, John leads our mission to deliver quality care at the customer's doorstep.</p>

						<div className="mt-4 flex items-center gap-3">
							<Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => setOpen(true)}>View Founder</Button>
							<Link href="/products">
								<Button variant="outline">Shop Now</Button>
							</Link>
						</div>
					</div>
				</div>

				{/* Why choose us */}
				<div className="mt-10 grid md:grid-cols-3 gap-6">
					<div className="bg-white rounded-lg shadow p-6">
						<h3 className="font-medium text-emerald-700">Trusted Suppliers</h3>
						<p className="text-sm text-muted-foreground mt-2">We partner only with licensed suppliers and maintain strict quality checks.</p>
					</div>
					<div className="bg-white rounded-lg shadow p-6">
						<h3 className="font-medium text-emerald-700">Fast Delivery</h3>
						<p className="text-sm text-muted-foreground mt-2">Same-day dispatch in city areas and reliable national shipping for other regions.</p>
					</div>
					<div className="bg-white rounded-lg shadow p-6">
						<h3 className="font-medium text-emerald-700">Patient Support</h3>
						<p className="text-sm text-muted-foreground mt-2">Professional pharmacists available for advice and prescription support.</p>
					</div>
				</div>

				<div className="mt-12 text-center text-sm text-muted-foreground">
					<Heart className="inline-block mr-2 text-emerald-600" />
					Built with care for your health.
				</div>
			</div>

			{/* Full-page modal to view founder image and bio */}
			{open && (
				<div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-6" onClick={() => setOpen(false)}>
					<div className="bg-white rounded-lg overflow-hidden max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
						<div className="p-6 md:flex md:gap-6">
							<div className="flex-shrink-0 h-64 w-64 rounded-full overflow-hidden mx-auto md:mx-0">
								<Image src="/JOHN OITO.jpg" alt="John Oito" width={512} height={512} className="object-cover h-full w-full" />
							</div>
							<div className="mt-4 md:mt-0">
								<h3 className="text-xl font-semibold">John Oito</h3>
								<p className="text-sm text-muted-foreground mt-2">Founder & Planner — John brings experience in healthcare operations and logistics. He founded PharmaCare to improve access to essential medicines and build a customer-first pharmacy experience.</p>
								<div className="mt-4 flex gap-2">
									<Link href="/products">
										<Button className="bg-emerald-600">Shop Products</Button>
									</Link>
									<Button variant="ghost" onClick={() => setOpen(false)}>Close</Button>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

export default AboutPage

