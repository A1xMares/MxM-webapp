import {Injectable, Inject, OnInit, Injector, ComponentRef} from '@angular/core';
import {Overlay, OverlayConfig, OverlayRef} from '@angular/cdk/overlay';
import {ComponentPortal, PortalInjector} from '@angular/cdk/portal';

import { FmoPdfViewerComponent } from '../../structure/winnipeg/freight-movement/fmo-pdf-viewer/fmo-pdf-viewer.component'
import { FmoPdfViewerOverlayRef } from '../../structure/winnipeg/freight-movement/fmo-pdf-viewer/fmo-pdf-viewer-ref'
import {FILE_PREVIEW_DIALOG_DATA} from "../../structure/winnipeg/freight-movement/fmo-pdf-viewer/fmo-pdf-viewer-tokens";

interface FmoPdfViewerDialogConfig {
  panelClass?: string;
  hasBackdrop?: boolean;
  backdropClass?: string;
  fmo?: any
}

const DEFAULT_CONFIG: FmoPdfViewerDialogConfig = {
  hasBackdrop: true,
  backdropClass: 'cdk-overlay-dark-backdrop',
  panelClass: 'tm-file-preview-dialog-panel mt-4'
};

@Injectable()
export class PdfPreviewService {

  constructor(
      private injector: Injector,
      private overlay: Overlay
  ) { }

  open(config: FmoPdfViewerDialogConfig = {}) {
    // Override default configuration
    const dialogConfig = { ...DEFAULT_CONFIG, ...config };

    // Returns an OverlayRef which is a PortalHost
    const overlayRef = this.createOverlay(dialogConfig);

    // Instantiate remote control
    const dialogRef = new FmoPdfViewerOverlayRef(overlayRef);

    const overlayComponent = this.attachDialogContainer(overlayRef, dialogConfig, dialogRef);

    // overlayRef.backdropClick().subscribe(_ => dialogRef.close());

    return dialogRef;
  }

  private attachDialogContainer(overlayRef: OverlayRef, config: FmoPdfViewerDialogConfig, dialogRef: FmoPdfViewerOverlayRef) {
    const injector = this.createInjector(config, dialogRef);

    const containerPortal = new ComponentPortal(FmoPdfViewerComponent, null, injector);
    const containerRef: ComponentRef<FmoPdfViewerComponent> = overlayRef.attach(containerPortal);

    return containerRef.instance;
  }

  private createInjector(config: FmoPdfViewerDialogConfig, dialogRef: FmoPdfViewerOverlayRef): PortalInjector {
    // Instantiate new WeakMap for our custom injection tokens
    const injectionTokens = new WeakMap();

    // Set custom injection tokens
    injectionTokens.set(FmoPdfViewerOverlayRef, dialogRef);
    injectionTokens.set(FILE_PREVIEW_DIALOG_DATA, config.fmo);

    // Instantiate new PortalInjector
    return new PortalInjector(this.injector, injectionTokens);
  }

  private createOverlay(config: FmoPdfViewerDialogConfig) {
    const overlayConfig = this.getOverlayConfig(config);
    return this.overlay.create(overlayConfig);
  }

  private getOverlayConfig(config: FmoPdfViewerDialogConfig): OverlayConfig {
    const positionStrategy = this.overlay.position()
        .global()
        .centerHorizontally()
        .centerVertically();

    const overlayConfig = new OverlayConfig({
      hasBackdrop: config.hasBackdrop,
      backdropClass: config.backdropClass,
      panelClass: config.panelClass,
      scrollStrategy: this.overlay.scrollStrategies.block(),
      positionStrategy
    });

    return overlayConfig;
  }

}
