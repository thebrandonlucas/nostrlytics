export const kindToTitle = {
	0: 'Metadata',
	1: 'Text',
	2: 'RecommendRelay',
	3: 'Contacts',
	4: 'EncryptedDirectMessage',
	5: 'EventDeletion',
	7: 'Reaction',
	40: 'ChannelCreation',
	41: 'ChannelMetadata',
	42: 'ChannelMessage',
	43: 'ChannelHideMessage',
	44: 'ChannelMuteUser',
	1984: 'Report',
	9734: 'ZapRequest',
	9735: 'Zap',
	10002: 'RelayList',
	22242: 'ClientAuth',
	30023: 'Article'
};

export const titleToKind = {
	Metadata: 0,
	Text: 1,
	RecommendRelay: 2,
	Contacts: 3,
	EncryptedDirectMessage: 4,
	EventDeletion: 5,
	Reaction: 7,
	ChannelCreation: 40,
	ChannelMetadata: 41,
	ChannelMessage: 42,
	ChannelHideMessage: 43,
	ChannelMuteUser: 44,
	Report: 1984,
	ZapRequest: 9734,
	Zap: 9735,
	RelayList: 10002,
	ClientAuth: 22242,
	Article: 30023
};

// Regex for pubkey hex, npub, and nip-05
export const rxHex = /^[0-9a-fA-F]{64}$/;
export const rxNpub = /^npub[0-9A-Za-z]{59}$/;
// Match emails, subdomains, or just the domain if the user is default (i.e. "_" user).
// Examples:
// example.com - (default user)
// exampleuser@example.com
// exampleuser@example.sample.com
// Emojis and emoji-like characters accepted by "Extended_Pictographic"
// Explanation: https://stackoverflow.com/a/72727900/20095400
export const rxNip05 =
	/^([-_a-zA-Z0-9\p{Extended_Pictographic}]+@)?[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)*?\.[a-zA-Z]{2,18}$/u;
