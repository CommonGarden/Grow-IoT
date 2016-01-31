# Figure out how to reference these with the event log and plant documents.
# Basically, how do with itegrate PeerDb with fs filesystem?

imageStore = new (FS.Store.GridFS)('images')
Images = new (FS.Collection)('images', stores: [ imageStore ])
