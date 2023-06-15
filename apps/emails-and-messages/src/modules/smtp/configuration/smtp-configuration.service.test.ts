import { vi, expect, describe, it } from "vitest";
import { SmtpConfigurationService } from "./smtp-configuration.service";
import { SettingsManager } from "@saleor/app-sdk/settings-manager";
import { SmtpPrivateMetadataManager } from "./smtp-metadata-manager";
import { SmtpConfig } from "./smtp-config-schema";

const mockSaleorApiUrl = "https://demo.saleor.io/graphql/";

const emptyConfigRoot: SmtpConfig = {
  configurations: [],
};

const validConfig: SmtpConfig = {
  configurations: [
    {
      id: "1685343953413npk9p",
      active: true,
      name: "Best name",
      smtpHost: "smtpHost",
      smtpPort: "1337",
      encryption: "NONE",
      channels: {
        override: false,
        channels: [],
        mode: "restrict",
      },
      events: [
        {
          active: true,
          eventType: "ORDER_CREATED",
          template: "template",
          subject: "Order {{ order.number }} has been created!!",
        },
        {
          active: false,
          eventType: "ORDER_FULFILLED",
          template: "template",
          subject: "Order {{ order.number }} has been fulfilled",
        },
        {
          active: false,
          eventType: "ORDER_CONFIRMED",
          template: "template",
          subject: "Order {{ order.number }} has been confirmed",
        },
        {
          active: false,
          eventType: "ORDER_CANCELLED",
          template: "template",
          subject: "Order {{ order.number }} has been cancelled",
        },
        {
          active: false,
          eventType: "ORDER_FULLY_PAID",
          template: "template",
          subject: "Order {{ order.number }} has been fully paid",
        },
        {
          active: false,
          eventType: "INVOICE_SENT",
          template: "template",
          subject: "New invoice has been created",
        },
        {
          active: false,
          eventType: "ACCOUNT_CONFIRMATION",
          template: "template",
          subject: "Account activation",
        },
        {
          active: false,
          eventType: "ACCOUNT_PASSWORD_RESET",
          template: "template",
          subject: "Password reset request",
        },
        {
          active: false,
          eventType: "ACCOUNT_CHANGE_EMAIL_REQUEST",
          template: "template",
          subject: "Email change request",
        },
        {
          active: false,
          eventType: "ACCOUNT_CHANGE_EMAIL_CONFIRM",
          template: "template",
          subject: "Email change confirmation",
        },
        {
          active: false,
          eventType: "ACCOUNT_DELETE",
          template: "template",
          subject: "Account deletion",
        },
      ],
      smtpUser: "John",
      smtpPassword: "securepassword",
      senderEmail: "no-reply@example.com",
      senderName: "Sender Name",
    },
    {
      id: "1685343951244olejs",
      active: false,
      name: "Deactivated name",
      smtpHost: "smtpHost",
      smtpPort: "1337",
      encryption: "NONE",
      channels: {
        override: false,
        channels: [],
        mode: "restrict",
      },
      events: [
        {
          active: true,
          eventType: "ORDER_CREATED",
          template: "template",
          subject: "Order {{ order.number }} has been created!!",
        },
        {
          active: false,
          eventType: "ORDER_FULFILLED",
          template: "template",
          subject: "Order {{ order.number }} has been fulfilled",
        },
        {
          active: false,
          eventType: "ORDER_CONFIRMED",
          template: "template",
          subject: "Order {{ order.number }} has been confirmed",
        },
        {
          active: false,
          eventType: "ORDER_CANCELLED",
          template: "template",
          subject: "Order {{ order.number }} has been cancelled",
        },
        {
          active: false,
          eventType: "ORDER_FULLY_PAID",
          template: "template",
          subject: "Order {{ order.number }} has been fully paid",
        },
        {
          active: false,
          eventType: "INVOICE_SENT",
          template: "template",
          subject: "New invoice has been created",
        },
        {
          active: false,
          eventType: "ACCOUNT_CONFIRMATION",
          template: "template",
          subject: "Account activation",
        },
        {
          active: false,
          eventType: "ACCOUNT_PASSWORD_RESET",
          template: "template",
          subject: "Password reset request",
        },
        {
          active: false,
          eventType: "ACCOUNT_CHANGE_EMAIL_REQUEST",
          template: "template",
          subject: "Email change request",
        },
        {
          active: false,
          eventType: "ACCOUNT_CHANGE_EMAIL_CONFIRM",
          template: "template",
          subject: "Email change confirmation",
        },
        {
          active: false,
          eventType: "ACCOUNT_DELETE",
          template: "template",
          subject: "Account deletion",
        },
      ],
      smtpUser: "John",
      smtpPassword: "securepassword",
      senderEmail: "no-reply@example.com",
      senderName: "Sender Name",
    },
  ],
};

describe("SmtpConfigurationService", function () {
  describe("constructor", () => {
    it("No API calls, when configuration is not requested", () => {
      const configurator = new SmtpPrivateMetadataManager(
        null as unknown as SettingsManager,
        mockSaleorApiUrl
      );

      const getConfigMock = vi.spyOn(configurator, "getConfig").mockResolvedValue(undefined);

      new SmtpConfigurationService({
        metadataManager: configurator,
      });

      expect(getConfigMock).toBeCalledTimes(0);
    });
  });

  describe("getConfigurationRoot", () => {
    it("The API should be called and response reused, when no initial data provided", async () => {
      const configurator = new SmtpPrivateMetadataManager(
        null as unknown as SettingsManager,
        mockSaleorApiUrl
      );

      const getConfigMock = vi.spyOn(configurator, "getConfig").mockResolvedValue(validConfig);

      const service = new SmtpConfigurationService({
        metadataManager: configurator,
      });

      const configuration = await service.getConfigurationRoot();

      expect(configuration).toEqual(validConfig);
      expect(getConfigMock).toBeCalledTimes(1);

      // Second call should not trigger API call
      await service.getConfigurationRoot();
      expect(getConfigMock).toBeCalledTimes(1);
    });

    it("The API should not be called when initial data were provided", async () => {
      const configurator = new SmtpPrivateMetadataManager(
        null as unknown as SettingsManager,
        mockSaleorApiUrl
      );

      const getConfigMock = vi.spyOn(configurator, "getConfig").mockResolvedValue(emptyConfigRoot);

      const service = new SmtpConfigurationService({
        metadataManager: configurator,
        initialData: { ...validConfig },
      });

      expect(await service.getConfigurationRoot()).toEqual(validConfig);

      expect(getConfigMock).toBeCalledTimes(0);
    });
  });
  describe("setConfigurationRoot", () => {
    it("The API should be called and value cached, when saving the configuration", async () => {
      const configurator = new SmtpPrivateMetadataManager(
        null as unknown as SettingsManager,
        mockSaleorApiUrl
      );

      const setConfigMock = vi.spyOn(configurator, "setConfig").mockResolvedValue();
      const getConfigMock = vi.spyOn(configurator, "getConfig").mockResolvedValue(emptyConfigRoot);

      // Service initialized with empty configuration
      const service = new SmtpConfigurationService({
        metadataManager: configurator,
        initialData: emptyConfigRoot,
      });

      // Set configuration
      await service.setConfigurationRoot(validConfig);

      expect(setConfigMock).toBeCalledTimes(1);
      expect(setConfigMock).toBeCalledWith(validConfig);

      // Since data should be cached automatically, no API call should be triggered
      expect(await service.getConfigurationRoot());
      expect(getConfigMock).toBeCalledTimes(0);
    });
  });

  describe("getConfiguration", () => {
    it("Returns configuration when existing ID is provided", async () => {
      const configurator = new SmtpPrivateMetadataManager(
        null as unknown as SettingsManager,
        mockSaleorApiUrl
      );

      const service = new SmtpConfigurationService({
        metadataManager: configurator,
        initialData: { ...validConfig },
      });

      expect(await service.getConfiguration({ id: validConfig.configurations[0].id })).toEqual(
        validConfig.configurations[0]
      );
    });

    it("Throws error when configuration with provided ID does not exist", async () => {
      const configurator = new SmtpPrivateMetadataManager(
        null as unknown as SettingsManager,
        mockSaleorApiUrl
      );

      const service = new SmtpConfigurationService({
        metadataManager: configurator,
        initialData: { ...validConfig },
      });

      await expect(
        async () => await service.getConfiguration({ id: "does-not-exist" })
      ).rejects.toThrow("Configuration not found");
    });
  });

  describe("getConfigurations", () => {
    it("Returns empty list when no configurations", async () => {
      const configurator = new SmtpPrivateMetadataManager(
        null as unknown as SettingsManager,
        mockSaleorApiUrl
      );

      const service = new SmtpConfigurationService({
        metadataManager: configurator,
        initialData: emptyConfigRoot,
      });

      expect(await service.getConfigurations()).toEqual([]);
    });

    it("Returns relevant configurations, when filter is passed", async () => {
      const configurator = new SmtpPrivateMetadataManager(
        null as unknown as SettingsManager,
        mockSaleorApiUrl
      );

      const service = new SmtpConfigurationService({
        metadataManager: configurator,
        initialData: { ...validConfig },
      });

      // Only the first configuration is active, so only this one should be returned
      expect(await service.getConfigurations({ active: true })).toEqual([
        validConfig.configurations[0],
      ]);
    });
  });

  describe("createConfiguration", () => {
    it("New configuration should be sent to API, when created", async () => {
      const configurator = new SmtpPrivateMetadataManager(
        null as unknown as SettingsManager,
        mockSaleorApiUrl
      );

      const setConfigMock = vi.spyOn(configurator, "setConfig").mockResolvedValue();

      const service = new SmtpConfigurationService({
        metadataManager: configurator,
        initialData: emptyConfigRoot,
      });

      const newConfiguration = await service.createConfiguration({
        active: true,
        channels: { channels: [], mode: "exclude", override: false },
        encryption: "NONE",
        name: "New configuration",
        smtpHost: "smtp.example.com",
        smtpPort: "587",
      });

      expect(newConfiguration.name).toEqual("New configuration");
      expect(setConfigMock).toBeCalledTimes(1);
    });
  });

  describe("updateConfiguration", () => {
    it("Configuration should be updated, when method is called", async () => {
      const configurator = new SmtpPrivateMetadataManager(
        null as unknown as SettingsManager,
        mockSaleorApiUrl
      );

      const setConfigMock = vi.spyOn(configurator, "setConfig").mockResolvedValue();
      const getConfigMock = vi.spyOn(configurator, "getConfig").mockResolvedValue(undefined);

      const service = new SmtpConfigurationService({
        metadataManager: configurator,
        initialData: { ...validConfig },
      });

      const updatedConfiguration = await service.updateConfiguration({
        id: validConfig.configurations[0].id,
        name: "Updated configuration",
      });

      expect(updatedConfiguration.name).toEqual("Updated configuration");
      expect(setConfigMock).toBeCalledTimes(1);

      const configurationFromCache = await service.getConfiguration({
        id: validConfig.configurations[0].id,
      });

      expect(getConfigMock).toBeCalledTimes(0);
      expect(configurationFromCache.name).toEqual("Updated configuration");
    });

    it("Error should be thrown, when configuration with given ID does not exist", async () => {
      const configurator = new SmtpPrivateMetadataManager(
        null as unknown as SettingsManager,
        mockSaleorApiUrl
      );

      const setConfigMock = vi.spyOn(configurator, "setConfig").mockResolvedValue();
      const getConfigMock = vi.spyOn(configurator, "getConfig").mockResolvedValue(undefined);

      const service = new SmtpConfigurationService({
        metadataManager: configurator,
        initialData: { ...validConfig },
      });

      await expect(() =>
        service.updateConfiguration({
          id: "this-id-does-not-exist",
          name: "Updated configuration",
        })
      ).rejects.toThrow("Configuration not found");
    });
  });

  describe("deleteConfiguration", () => {
    it("Configuration should be deleted, when method is called", async () => {
      const configurator = new SmtpPrivateMetadataManager(
        null as unknown as SettingsManager,
        mockSaleorApiUrl
      );

      const setConfigMock = vi.spyOn(configurator, "setConfig").mockResolvedValue();

      const service = new SmtpConfigurationService({
        metadataManager: configurator,
        initialData: { ...validConfig },
      });

      const idToBeDeleted = validConfig.configurations[0].id;

      await service.deleteConfiguration({
        id: idToBeDeleted,
      });

      // Change should be automatically pushed to the API
      expect(setConfigMock).toBeCalledTimes(1);

      await expect(
        async () => await service.getConfiguration({ id: idToBeDeleted })
      ).rejects.toThrow("Configuration not found");
    });
  });

  describe("deleteConfiguration", () => {
    it("Error should be thrown, when given ID does not exist", async () => {
      const configurator = new SmtpPrivateMetadataManager(
        null as unknown as SettingsManager,
        mockSaleorApiUrl
      );

      const setConfigMock = vi.spyOn(configurator, "setConfig").mockResolvedValue();

      const service = new SmtpConfigurationService({
        metadataManager: configurator,
        initialData: { ...validConfig },
      });

      await expect(async () =>
        service.deleteConfiguration({
          id: "this-id-does-not-exist",
        })
      ).rejects.toThrow("Configuration not found");

      // Since no changes were made, no API calls
      expect(setConfigMock).toBeCalledTimes(0);
    });
  });

  describe("getEventConfiguration", () => {
    it("Event configuration should be returned, when valid query", async () => {
      const configurator = new SmtpPrivateMetadataManager(
        null as unknown as SettingsManager,
        mockSaleorApiUrl
      );

      const service = new SmtpConfigurationService({
        metadataManager: configurator,
        initialData: { ...validConfig },
      });

      await expect(
        await service.getEventConfiguration({
          configurationId: validConfig.configurations[0].id,
          eventType: "ORDER_CREATED",
        })
      ).toEqual(validConfig.configurations[0].events[0]);
    });

    it("Should throw error, when configuration does not exist", async () => {
      const configurator = new SmtpPrivateMetadataManager(
        null as unknown as SettingsManager,
        mockSaleorApiUrl
      );

      const service = new SmtpConfigurationService({
        metadataManager: configurator,
        initialData: { ...validConfig },
      });

      await expect(async () =>
        service.getEventConfiguration({
          configurationId: "this-id-does-not-exist",
          eventType: "ORDER_CREATED",
        })
      ).rejects.toThrow("Configuration not found");

      await expect(async () =>
        service.getEventConfiguration({
          configurationId: validConfig.configurations[0].id,
          // @ts-ignore: Testing invalid event type
          eventType: "unsupported-event",
        })
      ).rejects.toThrow("Event configuration not found");
    });
  });

  describe("updateEventConfiguration", () => {
    it("Event configuration should be updated, when valid data passed", async () => {
      const configurator = new SmtpPrivateMetadataManager(
        null as unknown as SettingsManager,
        mockSaleorApiUrl
      );

      const setConfigMock = vi.spyOn(configurator, "setConfig").mockResolvedValue();

      const service = new SmtpConfigurationService({
        metadataManager: configurator,
        initialData: { ...validConfig },
      });

      await service.updateEventConfiguration({
        configurationId: validConfig.configurations[0].id,
        eventType: validConfig.configurations[0].events[0].eventType,
        eventConfiguration: {
          ...validConfig.configurations[0].events[0],
          subject: "Updated subject",
        },
      });

      expect(setConfigMock).toBeCalledTimes(1);

      const updatedEventConfiguration = await service.getEventConfiguration({
        configurationId: validConfig.configurations[0].id,
        eventType: "ORDER_CREATED",
      });

      expect(updatedEventConfiguration.subject).toEqual("Updated subject");
    });

    it("Should throw error, when configuration does not exist", async () => {
      const configurator = new SmtpPrivateMetadataManager(
        null as unknown as SettingsManager,
        mockSaleorApiUrl
      );

      const setConfigMock = vi.spyOn(configurator, "setConfig").mockResolvedValue();

      const service = new SmtpConfigurationService({
        metadataManager: configurator,
        initialData: { ...validConfig },
      });

      await expect(async () =>
        service.updateEventConfiguration({
          configurationId: "this-id-does-not-exist",
          eventType: validConfig.configurations[0].events[0].eventType,
          eventConfiguration: {
            ...validConfig.configurations[0].events[0],
            subject: "Updated subject",
          },
        })
      ).rejects.toThrow("Configuration not found");

      expect(setConfigMock).toBeCalledTimes(0);
    });
  });
});
