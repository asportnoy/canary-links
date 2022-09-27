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
				if (x.props.id?.endsWith('copy-link')) {
					x.props.action = () => copy(url);
				}
				if (x.props.children) checkChildren(x, url);
			});
		}

		function getMessageURL(channel, message) {
			return `https://discord.com/channels/${channel.guild_id || '@me'}/${
				channel.id
			}/${message.id}`;
		}

		function getChannelURL(channel) {
			return `https://discord.com/channels/${channel.guild_id || '@me'}/${channel.id}`;
		}

		const messageContextMenuFunc = (args, res) => {
			console.log(args);
			console.log(res);
			if (!args[0]?.message) return res;
			const url = getMessageURL(args[0].channel, args[0].message);

			checkChildren(res, url);

			return res;
		};

		const channelListContextMenuFunc = (args, res) => {
			if (!args[0]?.channel) return res;
			const url = getChannelURL(args[0].channel);

			if (!res.props.children) {
				// for some reason children don't exist
				res = new res.type(res.props);
			}

			checkChildren(res, url);

			return res;
		};

		injectContextMenu(
			'copy-link-contextmenu',
			'MessageContextMenu',
			messageContextMenuFunc,
		);

		injectContextMenu(
			'copy-link-search-contextmenu',
			'MessageSearchResultContextMenu',
			messageContextMenuFunc,
		);

		injectContextMenu(
			'copy-link-text-contextmenu',
			'ChannelListTextChannelContextMenu',
			channelListContextMenuFunc,
		);

		// TODO: fix this somehow
		injectContextMenu(
			'copy-link-thread-contextmenu',
			'ChannelListThreadContextMenu',
			channelListContextMenuFunc,
		);

		injectContextMenu(
			'copy-link-voice-contextmenu',
			'ChannelListVoiceChannelContextMenu',
			channelListContextMenuFunc,
		);

		inject('copy-link-dotmenu', MessageMenuItems, 'copyLink', args => {
			copy(getMessageURL(args[0], args[1]));
		});
	}
};
