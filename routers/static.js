const fs = require('fs');
const util = require('util');
const Renderer = require('vue-server-renderer');
const Router = require('koa-router');
const Vue = require('vue');

const redis = require('../lib/redis');
const Archive = require('./Archive');
const Channel = require('../lib/Channel');
const Message = require('../lib/Message');

const router = module.exports = new Router();

const renderer = Renderer.createRenderer({
	template: fs.readFileSync(`${__dirname}/../public/index.template.html`, 'utf-8')
});

router.get('/sitemap.xml', async ctx => {
	const instances = await redis.smembers('instances');

	const links = [{
		location: '/',
		modified: new Date(1548374917723),
		change: 'daily',
		priority: 1
	}];

	for(const instance of instances) {
		for(const id of await Channel.findIds(instance)) {
			const lastMessage = await Message.getLast(instance, id);

			if(lastMessage) {
				links.push({
					location: `/archive/${instance}/channel/${id}`,
					modified: lastMessage ? new Date(+lastMessage.date) : new Date(),
					change: 'daily',
					priority: 1
				});
			}
		}
	}

	ctx.type = 'text/xml';

	ctx.body = `<?xml version="1.0" encoding="utf-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
   xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
	${links.map(link => `
		<url>
			<loc>https://nile.chat${link.location}</loc>

			<lastmod>${link.modified.getFullYear()}-${link.modified.getMonth() + 1}-${link.modified.getDate()}</lastmod>
			<changefreq>${link.change}</changefreq>
	        <priority>${link.priority}</priority>
		</url>
	`).join('\n')}
</urlset>`;
});

router.get('/archive/:instance/channel/:channel', async ctx => {
	const channel = await Channel.get(ctx.params.instance, ctx.params.channel);

	console.log(channel);

	const app = new Vue({
		data: {
			channel
		},
		components: {
			Archive
		},
		template: `<Archive v-bind:channel="channel"></Archive>`
	});

	const render = util.promisify((...args) => renderer.renderToString(...args));

	ctx.body = await render(app, {
		title: `#${channel.name}`
	});
});
