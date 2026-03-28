<!-- Home Page in Svelte -->

<!-- Header -->
<header class="bg-blue-700 text-white py-6 mb-8">
	<div class="container mx-auto flex flex-col md:flex-row justify-between items-center px-4">
		<h1 class="text-3xl font-bold">My SvelteKit SaaS</h1>
		<nav class="space-x-6 mt-4 md:mt-0">
			<a href="#features" class="hover:underline">Features</a>
			<a href="#pricing" class="hover:underline">Pricing</a>
			<a href="#contact" class="hover:underline">Contact</a>
		</nav>
	</div>
</header>

<main class="container mx-auto px-4">
	<!-- Hero Section -->
	<section class="text-center my-16">
		<h2 class="text-4xl font-extrabold mb-4">The best way to build with SvelteKit</h2>
		<p class="text-xl text-gray-600 mb-8">
			Launch your next project faster. Simple. Modern. Lightning fast.
		</p>
		<a href="#pricing" class="inline-block bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 px-8 rounded shadow">
			Get Started
		</a>
	</section>

	<!-- Features Section -->
	<section id="features" class="my-24">
		<h3 class="text-2xl font-bold mb-6 text-center">Features</h3>
		<div class="grid md:grid-cols-3 gap-8">
			<div class="p-6 bg-white rounded shadow text-center">
				<svg class="mx-auto mb-4 h-10 w-10 text-blue-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
					<circle cx="12" cy="12" r="10"></circle>
				</svg>
				<h4 class="font-semibold text-lg mb-2">Easy Integration</h4>
				<p class="text-gray-600">Connect with your favorite tools seamlessly.</p>
			</div>
			<div class="p-6 bg-white rounded shadow text-center">
				<svg class="mx-auto mb-4 h-10 w-10 text-blue-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
					<rect x="4" y="4" width="16" height="16"></rect>
				</svg>
				<h4 class="font-semibold text-lg mb-2">Fast Performance</h4>
				<p class="text-gray-600">Optimized for speed and scalability out of the box.</p>
			</div>
			<div class="p-6 bg-white rounded shadow text-center">
				<svg class="mx-auto mb-4 h-10 w-10 text-blue-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
					<path d="M12 2v20"></path>
					<path d="M2 12h20"></path>
				</svg>
				<h4 class="font-semibold text-lg mb-2">Modern UI</h4>
				<p class="text-gray-600">Beautiful, responsive components you’ll love to use.</p>
			</div>
		</div>
	</section>

	<!-- Pricing Section -->
	<section id="pricing" class="my-24">
		<h3 class="text-2xl font-bold mb-6 text-center">Pricing</h3>
		<div class="flex flex-col md:flex-row justify-center gap-8">
			<div class="bg-white shadow rounded-lg p-8 text-center">
				<h4 class="text-lg font-semibold mb-4">Free</h4>
				<p class="text-4xl font-extrabold mb-4">$0</p>
				<ul class="text-gray-600 mb-6">
					<li>Basic features</li>
					<li>Community support</li>
				</ul>
				<button class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold">Sign Up</button>
			</div>
			<div class="bg-blue-700 text-white shadow rounded-lg p-8 text-center">
				<h4 class="text-lg font-semibold mb-4">Pro</h4>
				<p class="text-4xl font-extrabold mb-4">$15<span class="text-base font-normal">/mo</span></p>
				<ul class="mb-6">
					<li>Everything in Free</li>
					<li>Premium features</li>
					<li>Priority support</li>
				</ul>
				<button class="bg-white text-blue-700 hover:bg-gray-100 px-6 py-2 rounded font-semibold">Get Pro</button>
			</div>
		</div>
	</section>

	<!-- Contact Section -->
	<section id="contact" class="my-24 text-center">
		<h3 class="text-2xl font-bold mb-6">Contact Us</h3>
		<p class="text-gray-600 mb-4">Have questions or need help? Fill out the form below.</p>
		<form class="max-w-lg mx-auto bg-white rounded shadow p-6 space-y-4">
			<div>
				<label class="block mb-1 font-semibold" for="name">Name</label>
				<input type="text" id="name" name="name" class="w-full border px-3 py-2 rounded" required />
			</div>
			<div>
				<label class="block mb-1 font-semibold" for="email">Email</label>
				<input type="email" id="email" name="email" class="w-full border px-3 py-2 rounded" required />
			</div>
			<div>
				<label class="block mb-1 font-semibold" for="message">Message</label>
				<textarea id="message" name="message" rows="4" class="w-full border px-3 py-2 rounded" required></textarea>
			</div>
			<button type="submit" class="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded font-semibold">
				Send Message
			</button>
		</form>
	</section>
</main>

<!-- Footer -->
<footer class="bg-gray-100 py-6 mt-16 text-center text-gray-600">
	&copy; {new Date().getFullYear()} My SvelteKit SaaS. All rights reserved.
</footer>
