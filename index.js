const { Plugin } = require('powercord/entities');
const { getModule } = require('powercord/webpack');
const { inject, uninject } = require('powercord/injector');
const { injectContextMenu } = require('powercord/util');

module.exports = class ViewRaw extends Plugin {
	startPlugin() {
		this.run();
	}

	pluginWillUnload() {
		uninject('copy-link-contextmenu');
		uninject('copy-link-search-contextmenu');
		uninject('copy-link-text-contextmenu');
		uninject('copy-link-thread-contextmenu');
		uninject('copy-link-voice-contextmenu');
		uninject('copy-link-dotmenu');
	}

	async run() {
		const { copy } = await getModule(['copy', 'readClipboard']);
		const MessageMenuItems = await getModule(['copyLink', 'pinMessage']);

		function checkChildren(el, url) {
			if (!Array.isArray(el.props.children))
				el.props.children = [el.props.children];
			el.props.children.forEach(x => {
				if (!x || !x.props) return;
				if (x.props.id === 'copy-link') {
					x.props.action = () => copy(url);
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
			const url = getURL(args[0].channel, args[0].message);

			checkChildren(res, url);

			return res;
		};

		injectContextMenu(
			'copy-link-contextmenu',
			'MessageContextMenu',
			contextMenuFunc,
		);

		injectContextMenu(
			'copy-link-search-contextmenu',
			'MessageSearchResultContextMenu',
			contextMenuFunc,
		);

		injectContextMenu(
			'copy-link-text-contextmenu',
			'ChannelListTextChannelContextMenu',
			contextMenuFunc,
		);

		injectContextMenu(
			'copy-link-thread-contextmenu',
			'ChannelListThreadContextMenu',
			contextMenuFunc,
		);

		injectContextMenu(
			'copy-link-voice-contextmenu',
			'ChannelListVoiceChannelContextMenu',
			contextMenuFunc,
		);

		inject('copy-link-dotmenu', MessageMenuItems, 'copyLink', args => {
			copy(getURL(args[0], args[1]));
		});
	}
};
