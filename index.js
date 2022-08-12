const {Plugin} = require('powercord/entities');
const {getModule} = require('powercord/webpack');
const {inject, uninject} = require('powercord/injector');
const {injectContextMenu} = require('powercord/util');

module.exports = class ViewRaw extends Plugin {
	startPlugin() {
		this.run();
	}

	pluginWillUnload() {
		uninject('copy-link-contextmenu');
		uninject('copy-link-searchcontextmenu');
		uninject('copy-link-dotmenu');
	}

	async run() {
		const {clipboard} = await getModule(['clipboard']);
		const MessageMenuItems = await getModule(['copyLink', 'pinMessage']);

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

		const contextMenuFunc = (args, res) => {
			if (!args[0]?.message) return res;
			let url = getURL(args[0].channel, args[0].message);

			checkChildren(res, url);

			return res;
		}

		injectContextMenu(
			'copy-link-contextmenu',
			'MessageContextMenu',
			contextMenuFunc,
		);

		injectContextMenu(
			'copy-link-searchcontextmenu',
			'MessageSearchResultContextMenu',
			contextMenuFunc,
		)

		inject('copy-link-dotmenu', MessageMenuItems, 'copyLink', args => {
			clipboard.copy(getURL(args[0], args[1]));
		});
	}
};
