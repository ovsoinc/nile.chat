<template>
	<div class="flex-1 flex flex-col bg-white overflow-hidden">
		<!-- Top bar -->
		<div class="border-b flex px-6 py-2 items-center flex-none">
			<div class="flex flex-col">
				<h3 class="text-grey-darkest mb-1 font-extrabold hidden md:block">{{direct.user.name}}</h3>
				<div class="inline-block relative w-64 block md:hidden">
					<select v-model="selected" v-on:change="updateSelected" class="block appearance-none w-full bg-white border border-grey-light hover:border-grey px-4 py-2 pr-8 rounded leading-tight focus:outline-none">
						<option class="font-bold text-black" disabled>Channels</option>
						<option v-for="channel in channels" v-bind:value="JSON.stringify([ 'channel', channel.id ])"><span style="margin-left: 50px;">&nbsp;&nbsp;&nbsp;#{{channel.name}}</span></option>
						<option class="font-bold text-black" disabled>Direct Messages</option>
						<option class="pr-5 mr-5" v-for="direct in directs" v-bind:value="JSON.stringify([ 'direct', direct.user.id ])">&nbsp;&nbsp;&nbsp;{{direct.user.name}}</option>
					</select>
					<div class="pointer-events-none absolute pin-y pin-r flex items-center px-2 text-grey-darker">
						<svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
					</div>
				</div>
				<div class="text-grey-dark text-sm truncate hidden md:block">
					Direct Message
				</div>
			</div>
			<div class="ml-auto hidden md:block">
				<div class="relative">

				</div>
			</div>
		</div>
		<!-- Chat messages -->
		<div v-on:scroll="scroll" class="px-6 py-4 flex-1 overflow-y-scroll" ref="chat" style="
		height: 85vh !important;
		">
		<div v-for="message in direct.messages">
			<Message v-bind:message="message"></Message>
		</div>
	</div>

	<div class="pb-6 px-4 flex-none">
		<div class="flex rounded-lg border-2 border-grey overflow-hidden">
			<span class="text-3xl text-grey border-r-2 border-grey p-2">
				<svg class="fill-current h-6 w-6 block" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M16 10c0 .553-.048 1-.601 1H11v4.399c0 .552-.447.601-1 .601-.553 0-1-.049-1-.601V11H4.601C4.049 11 4 10.553 4 10c0-.553.049-1 .601-1H9V4.601C9 4.048 9.447 4 10 4c.553 0 1 .048 1 .601V9h4.399c.553 0 .601.447.601 1z"/></svg>
			</span>
			<input v-bind:placeholder="'Message ' + direct.user.name" v-model="message" v-on:keyup.13="handleMessage" type="text" class="w-full px-4" />
		</div>
	</div>
</div>
</template>

<script>
const Message = require('./Message.vue');

module.exports = {
	props: [
		"channels",
		"directs",
		"direct"
	],
	data: () => ({
		message: "",
		docked: true,
		selected: null,
		searchQuery: ''
	}),
	created() {
		this.selected = JSON.stringify([ 'direct', this.direct.user.id ]);
	},
	methods: {
		handleMessage() {
			this.$emit('message', this.direct.user, this.message);
			this.message = "";
			this.docked = true;
		},
		scroll() {
			this.docked = this.$refs.chat.scrollTop === (this.$refs.chat.scrollHeight - this.$refs.chat.offsetHeight);

			if(this.docked === true) {
				this.$refs.chat.scrollTop = this.$refs.chat.scrollHeight;
			}
		},
		updateSelected() {
			this.$emit('selected', ...JSON.parse(this.selected));
		}
	},
	mounted() {
		this.$refs.chat.scrollTop = this.$refs.chat.scrollHeight - this.$refs.chat.offsetHeight;
	},
	updated() {
		if(this.docked === true) {
			this.$refs.chat.scrollTop = this.$refs.chat.scrollHeight;
		}
	},
	components: {
		Message
	}
};
</script>
