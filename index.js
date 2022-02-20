const {Plugin} = require('powercord/entities');
const {getModule} = require('powercord/webpack');
const {inject, uninject} = require('powercord/injector');

module.exports = class ViewRaw extends Plugin {
	startPlugin() {
		this.run();
	}

	pluginWillUnload() {
		uninject('copy-link-contextmenu');
		uninject('copy-link-dotmenu');
	}

	async run() {
		const {clipboard} = await getModule(['clipboard']);
		const MessageContextMenu = await getModule(
			m => m?.default?.displayName === 'MessageContextMenu',
		);
		const MessageMenuItems = await getModule(['copyLink', 'pinMessage']);
		console.log(MessageMenuItems);

		function checkChildren(el, url) {
			if (!Array.isArray(el.props.children))
				el.props.children = [el.props.children];
			el.props.children.forEach(x => {
				if (!x || !x.props) return;
				if (x.props.id == 'copy-link') {
					x.props.action = () => clipboard.copy(url);
				}
				if (x.props.children) checkChildren(x, url);
			});
		}

		function getURL(channel, message) {
			return `https://discord.com/channels/${channel.guild_id || '@me'}/${
				channel.id
			}/${message.id}`;
		}

		inject(
			'copy-link-contextmenu',
			MessageContextMenu,
			'default',
			(args, res) => {
				if (!args[0]?.message) return res;
				let url = getURL(args[0].channel, args[0].message);

				checkChildren(res, url);

				return res;
			},
		);

		inject('copy-link-dotmenu', MessageMenuItems, 'copyLink', args => {
			clipboard.copy(getURL(args[0], args[1]));
		});

		MessageContextMenu.default.displayName = 'MessageContextMenu';
	}
};
