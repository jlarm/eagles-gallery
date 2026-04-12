import GalleryController from './GalleryController'
import AnalyticsController from './AnalyticsController'
import DashboardController from './DashboardController'
import QueueController from './QueueController'
import TournamentController from './TournamentController'
import AlbumController from './AlbumController'
import PhotoController from './PhotoController'
import Settings from './Settings'

const Controllers = {
    GalleryController: Object.assign(GalleryController, GalleryController),
    AnalyticsController: Object.assign(AnalyticsController, AnalyticsController),
    DashboardController: Object.assign(DashboardController, DashboardController),
    QueueController: Object.assign(QueueController, QueueController),
    TournamentController: Object.assign(TournamentController, TournamentController),
    AlbumController: Object.assign(AlbumController, AlbumController),
    PhotoController: Object.assign(PhotoController, PhotoController),
    Settings: Object.assign(Settings, Settings),
}

export default Controllers